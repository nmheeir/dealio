import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';

export const productImageSchema = z.object({
  id: z.string(),
  product_url: z.url(),
  is_main: z.boolean(),
}).extend(baseTimeStampSchema.shape);

export type ProductImage = z.infer<typeof productImageSchema>;
