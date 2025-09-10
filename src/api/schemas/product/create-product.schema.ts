import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  product_type: z.enum(['DEVICE', 'CARD_PHYSICAL', 'CARD_DIGITAL_KEY']),
  seo_title: z.string().min(1, 'Too short'),
  seo_description: z.string().min(1, 'Too short'),
  category_id: z.string().min(1, 'Danh mục là bắt buộc'),
  brand_id: z.string().min(1, 'Thương hiệu là bắt buộc'),
});

export type CreateProduct = z.infer<typeof createProductSchema>;
