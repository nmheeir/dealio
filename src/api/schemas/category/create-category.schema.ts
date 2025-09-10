import { z } from 'zod';

// Category schema
export const createCategorySchema = z.object({
  name: z.string().nonempty('Must not be empty'),
  description: z.string().nonempty('Must not be empty'),
  seo_title: z.string().nonempty('Must not be empty'),
  seo_description: z.string().nonempty('Must not be empty'),
  parent_id: z.string().optional(),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;
