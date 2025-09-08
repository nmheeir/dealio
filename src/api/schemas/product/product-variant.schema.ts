import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';
import { stockSchema } from '../stock/stock.schema';
import { productImageSchema } from './product-image.schema';
import { productSchema } from './product.schema';

export const otherAttributesSchema = z.object({
  ram: z.string(),
  color: z.string(),
  storage: z.string(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  variant_name: z.string(),
  slug: z.string(),
  sku: z.string(),
  price: z.string(),
  cost_price: z.string().optional(),
  discount: z.string(),
  color: z.string(),
  other_attributes: z.record(z.string(), z.string()),
  images: z.array(productImageSchema),
  product: productSchema,
  stock: stockSchema.optional(),
}).extend(baseTimeStampSchema.shape);

export type ProductVariant = z.infer<typeof productVariantSchema>;
export type OtherAttributes = z.infer<typeof otherAttributesSchema>;
