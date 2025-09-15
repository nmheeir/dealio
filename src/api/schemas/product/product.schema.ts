import { z } from 'zod';
import { brandSchema } from '../brand/brand.schema';
import { categorySchema } from '../category/category.schema';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';

export enum ProductType {
  CARD_PHYSICAL = 'CARD_PHYSICAL',
  CARD_DIGITAL_KEY = 'CARD_DIGITAL_KEY',
  DEVICE = 'DEVICE',
}

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  product_type: z.enum(ProductType),
  status: z.string(),
  slug: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  image: z.url().nullable(),
  price: z.number().nullable(),
  category: categorySchema,
  brand: brandSchema,
}).extend(baseTimeStampSchema.shape);

export type Product = z.infer<typeof productSchema>;
