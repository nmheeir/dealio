import { z } from 'zod';

export const ReportTopProductSchema = z.object({
  productId: z.uuid(),
  productName: z.string(),
  variantId: z.uuid(),
  variantName: z.string(),
  sku: z.string(),
  totalQuantitySold: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  categoryName: z.string(),
  brandName: z.string(),
});

export type ReportTopProduct = z.infer<typeof ReportTopProductSchema>;
