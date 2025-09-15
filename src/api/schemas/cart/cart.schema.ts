import { z } from 'zod';

// Enum riêng cho trạng thái sản phẩm trong giỏ hàng
export const ProductStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']);
export type ProductStatus = z.infer<typeof ProductStatusEnum>;

// Schema cho item trong giỏ hàng
export const cartItemSchema = z.object({
  createdAt: z.iso.datetime(), // ISO 8601
  updatedAt: z.iso.datetime(),
  id: z.uuid(),
  product_variant_id: z.uuid(),
  quantity: z.number().int().nonnegative(),
  name: z.string(),
  imageUrl: z.url(),
  price: z.string(),
  discount: z.string(),
  productStatus: ProductStatusEnum,
});

export type CartItem = z.infer<typeof cartItemSchema>;
