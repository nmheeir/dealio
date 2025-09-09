import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';

export const addressInputSchema = z.object({
  to_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  to_phone: z
    .string()
    .regex(/^\d+$/, 'Số điện thoại chỉ chứa chữ số')
    .min(9, 'Số điện thoại phải có ít nhất 9 số'),
  to_address: z.string().min(5, 'Địa chỉ quá ngắn'),
  to_ward_code: z.string().min(1, 'Mã phường/xã bắt buộc'),
  to_district_id: z.string().min(1, 'Mã quận/huyện bắt buộc'),
  to_province_name: z.string().min(2, 'Tên tỉnh/thành phố quá ngắn'),
});

export const addressSchema = addressInputSchema.extend({
  id: z.string(),
  is_default: z.boolean(),
}).extend(baseTimeStampSchema.shape);

export type Address = z.infer<typeof addressSchema>;
export type AddressInput = z.infer<typeof addressInputSchema>;
