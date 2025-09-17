import z from 'zod';
import { productVariantSchema } from '../product/product-variant.schema';

export const orderItemSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string(),
  quantity: z.number(),
  price: z.string(),
  productVariant: productVariantSchema,
});

export type OrderItem = z.infer<typeof orderItemSchema>;
