import { z } from 'zod';

export const updateBrandSchema = z.object({
  name: z.string(),
  description: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
});

export type UpdateBrand = z.infer<typeof updateBrandSchema>;
