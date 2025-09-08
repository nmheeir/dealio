import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';

// Children schema
export const childrenSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
}).extend(baseTimeStampSchema.shape);

export type Children = z.infer<typeof childrenSchema>;

// Category schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  children: z.array(childrenSchema).optional(),
}).extend(baseTimeStampSchema.shape);

export type Category = z.infer<typeof categorySchema>;
