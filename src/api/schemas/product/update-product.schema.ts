import z from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  category_id: z.string().min(1, 'Danh mục là bắt buộc'),
  seo_title: z.string().min(1, 'Too short'),
  seo_description: z.string().min(1, 'Too short'),
  brand_id: z.string().min(1, 'Thương hiệu là bắt buộc'),
  description: z.string().optional(),
});

export type UpdateProduct = z.infer<typeof updateProductSchema>;
