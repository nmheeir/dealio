'use server';

import type { CreateStoreSchema } from '../validations/store';

import { desc, eq } from 'drizzle-orm';

import {
  unstable_noStore as noStore,
  revalidateTag,
} from 'next/cache';
import { db } from '@/db';
import { stores } from '@/db/schema';
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
