import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().nonempty('Too short'),
  description: z.string().nonempty('Too short'),
  seo_title: z.string().nonempty('Too short'),
  seo_description: z.string().nonempty('Too short'),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
