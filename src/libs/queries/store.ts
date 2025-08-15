import { desc, eq } from 'drizzle-orm';

import {
  unstable_noStore as noStore,
} from 'next/cache';
import { db } from '@/db';
import { stores } from '@/db/schema';
import { takeFirstOrThrow } from '@/db/utils';
import 'server-only';

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
