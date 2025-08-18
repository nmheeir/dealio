/* eslint-disable unused-imports/no-unused-vars */
'use server';

import type { Product } from '@/db/schema';
import type { SearchParams } from '@/types';
import { and, asc, count, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache';
import { db } from '@/db';
import { categories, products, stores, subcategories } from '@/db/schema';
import { getProductsSchema } from '../validations/product';

export async function getFeaturedProducts() {
  return await cache(
    async () => {
      return db
        .select({
          id: products.id,
          name: products.name,
          images: products.images,
          category: categories.name,
          price: products.price,
          inventory: products.inventory,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(8)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .groupBy(products.id, stores.stripeAccountId, categories.name)
        .orderBy(
          desc(count(stores.stripeAccountId)),
          desc(count(products.images)),
          desc(products.createdAt),
        );
    },
    ['featured-products'],
    {
      revalidate: 3600, // every hour
      tags: ['featured-products'],
    },
  )();
}

export async function getProducts(input: SearchParams) {
  noStore();

  try {
    const search = getProductsSchema.parse(input);

    const limit = search.per_page;
    const offset = (search.page - 1) * limit;

    const [column, order] = (search.sort?.split('.') as [
      keyof Product | undefined,
      'asc' | 'desc' | undefined,
    ]) ?? ['createdAt', 'desc'];
    const [minPrice, maxPrice] = search.price_range?.split('-') ?? [];
    const categoryIds = search.categories?.split('.') ?? [];
    const subcategoryIds = search.subcategories?.split('.') ?? [];
    const storeIds = search.store_ids?.split('.') ?? [];

    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          images: products.images,
          category: categories.name,
          subcategory: subcategories.name,
          price: products.price,
          inventory: products.inventory,
          rating: products.rating,
          storeId: products.storeId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(limit)
        .offset(offset)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
        .where(
          and(
            categoryIds.length > 0
              ? inArray(products.categoryId, categoryIds)
              : undefined,
            subcategoryIds.length > 0
              ? inArray(products.subcategoryId, subcategoryIds)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined,
            input.active === 'true'
              ? sql`(${stores.stripeAccountId}) is not null`
              : undefined,
          ),
        )
        .groupBy(products.id)
        .orderBy(
          column && column in products
            ? order === 'asc'
              ? asc(products[column])
              : desc(products[column])
            : desc(products.createdAt),
        );

      const total = await tx
        .select({
          count: count(products.id),
        })
        .from(products)
        .where(
          and(
            categoryIds.length > 0
              ? inArray(products.categoryId, categoryIds)
              : undefined,
            subcategoryIds.length > 0
              ? inArray(products.subcategoryId, subcategoryIds)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined,
          ),
        )
        .execute()
        .then(res => res[0]?.count ?? 0);

      const pageCount = Math.ceil(total / limit);

      return {
        data,
        pageCount,
      };
    });

    return transaction;
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
    };
  }
}

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          image: categories.image,
        })
        .from(categories)
        .orderBy(desc(categories.name));
    },
    ['categories'],
    {
      revalidate: 3600, // every hour
      tags: ['categories'],
    },
  )();
}

export async function getProductCountByCategory({
  categoryId,
}: {
  categoryId: string;
}) {
  return await cache(
    async () => {
      return db
        .select({
          count: count(products.id),
        })
        .from(products)
        .where(eq(products.categoryId, categoryId))
        .execute()
        .then(res => res[0]?.count ?? 0);
    },
    [`product-count-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`product-count-${categoryId}`],
    },
  )();
}
