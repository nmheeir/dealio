import { z } from 'zod';

export const ReportByProductTypeSchema = z.object({
  productId: z.uuid(),
  productName: z.string(),
  variantId: z.uuid(),
  variantName: z.string(),
  sku: z.string(),
  productType: z.string(),
  totalQuantitySold: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  categoryName: z.string(),
  brandName: z.string(),
});

export type ReportByProductType = z.infer<typeof ReportByProductTypeSchema>;
