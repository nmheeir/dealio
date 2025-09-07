import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  product_type: z.string(),
  status: z.string(),
  slug: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  category_id: z.string(),
  brand_id: z.string(),
}).extend(baseTimeStampSchema);

export type Product = z.infer<typeof productSchema>;
