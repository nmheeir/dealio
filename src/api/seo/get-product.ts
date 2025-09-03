/* eslint-disable no-console */
import { unstable_cache } from 'next/cache';
import apiClient from '../common/client';

export const getProduct = unstable_cache(
  async (slug: string) => {
    console.log(`[getProduct] Start fetching product with slug: ${slug}`);

    try {
      const response = await apiClient.get(`/product-variants/${slug}`);
      console.log(`[getProduct] Fetch successful for slug: ${slug}`, response.data);
      return response.data.data;
    } catch (err) {
      console.error(`[getProduct] Error fetching product for slug: ${slug}`, err);
      return null;
    }
  },
);
