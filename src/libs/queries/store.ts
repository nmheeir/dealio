'use server';

import type { CreateStoreSchema } from '../validations/store';

import { count, countDistinct, desc, eq, sql } from 'drizzle-orm';

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
  revalidateTag,
} from 'next/cache';
import { db } from '@/db';
import { products, stores } from '@/db/schema';
import { orders } from '@/db/schema/orders';
import { takeFirstOrThrow } from '@/db/utils';
import { getErrorMessage } from '../handle-error';
import { slugify } from '../utils';

export async function getStoreByUserId(input: { userId: string }) {
  noStore();
  try {
    const store = await db
      .select({
        id: stores.id,
        slug: stores.slug,
      })
      .from(stores)
      .where(eq(stores.userId, input.userId))
      .orderBy(desc(stores.stripeAccountId))
      .then(takeFirstOrThrow);

    return store;
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (err) {
    return null;
  }
}

export async function getStoresByUserId(input: { userId: string }) {
  return await cache(
    async () => {
      return db
        .select({
          id: stores.id,
          name: stores.name,
          slug: stores.slug,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
          productCount: count(products.id),
          orderCount: count(orders.id),
          customerCount: countDistinct(orders.email),
        })
        .from(stores)
        .leftJoin(products, eq(products.storeId, stores.id))
        .leftJoin(orders, eq(orders.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(stores.stripeAccountId), desc(sql<number>`count(*)`))
        .where(eq(stores.userId, input.userId));
    },
    [`stores-${input.userId}`],
    {
      revalidate: 900,
      tags: [`stores-${input.userId}`],
    },
  )();
}

export async function createStore(
  input: CreateStoreSchema & { userId: string },
) {
  noStore();
  try {
    const newStore = await db
      .insert(stores)
      .values({
        name: input.name,
        description: input.description,
        userId: input.userId,
        slug: slugify(input.name),
      })
      .returning({
        id: stores.id,
        slug: stores.slug,
      })
      .then(res => res[0]);

    revalidateTag(`stores-${input.userId}`);

    return {
      data: newStore,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function getFeaturedStores() {
  return await cache(
    async () => {
      return db
        .select({
          id: stores.id,
          name: stores.name,
          slug: stores.slug,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
          productCount: count(products.id),
        })
        .from(stores)
        .limit(4)
        .leftJoin(products, eq(products.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(sql<number>`count(*)`));
    },
    ['featured-stores'],
    {
      revalidate: 3600, // every hour
      tags: ['featured-stores'],
    },
  )();
}
