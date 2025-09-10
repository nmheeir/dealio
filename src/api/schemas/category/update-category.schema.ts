import { z } from 'zod';

// Category schema
export const updateCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  parent_id: z.string().optional(),
});

export type UpdateCategory = z.infer<typeof updateCategorySchema>;
