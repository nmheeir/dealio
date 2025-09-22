import { z } from 'zod';

export const ReportByProductTypeSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string(),
  variantId: z.string().uuid(),
  variantName: z.string(),
  sku: z.string(),
  productType: z.string(),
  totalQuantitySold: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  categoryName: z.string(),
  brandName: z.string(),
});

export type ReportByProductType = z.infer<typeof ReportByProductTypeSchema>;
