import { z } from 'zod';

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  slug: z.string(),
});

export type Brand = z.infer<typeof brandSchema>;
