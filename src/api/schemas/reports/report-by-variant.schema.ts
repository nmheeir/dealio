import { z } from 'zod';

export const ReportByVariantSchema = z.object({
  variantId: z.uuid(),
  variantName: z.string(),
  sku: z.string(),
  productId: z.uuid(),
  productName: z.string(),
  productType: z.string(),
  categoryName: z.string(),
  brandName: z.string(),
  quantitySold: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalCost: z.number().nonnegative(),
  totalProfit: z.number(),
  profitMargin: z.number(), // %
});

export type ReportByVariant = z.infer<typeof ReportByVariantSchema>;
