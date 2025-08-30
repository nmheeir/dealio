/* eslint-disable no-console */
import { unstable_cache } from 'next/cache';
import { client } from '@/api/common';

export const getProduct = unstable_cache(
  async (slug: string) => {
    console.log(`[getProduct] Start fetching product with slug: ${slug}`);

    try {
      const response = await client.get(`/product-variants/${slug}`);
      console.log(`[getProduct] Fetch successful for slug: ${slug}`, response.data);
      return response.data.data;
    } catch (err) {
      console.error(`[getProduct] Error fetching product for slug: ${slug}`, err);
      return null;
    }
  },
);
