import z from 'zod';

// Schema cho form cập nhật tồn kho
export const stockUpdateSchema = z.object({
  adjustmentType: z.enum(['increase', 'decrease']),
  adjustmentQuantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
  // reason: z.string().min(1, 'Vui lòng nhập lý do điều chỉnh').max(500, 'Lý do không được quá 500 ký tự'),
});

export type StockUpdate = z.infer<typeof stockUpdateSchema>;
