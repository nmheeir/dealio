import { z } from 'zod';
import { productVariantSchema } from './product-variant.schema';
import { productSchema } from './product.schema';

export const searchProductResponseSchema = z.object({
  products: z.array(productSchema),
  variants: z.array(productVariantSchema),
});

export type SearchProductResponse = z.infer<typeof searchProductResponseSchema>;
