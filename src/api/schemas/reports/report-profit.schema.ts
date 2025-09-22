import { z } from 'zod';

export const ReportProfitSchema = z.object({
  totalProfit: z.number(),
  totalRevenue: z.number().nonnegative(),
  totalCost: z.number().nonnegative(),
  profitMargin: z.number(), // %
  productType: z.string().optional(), // ví dụ: "DEVICE"
  orderType: z.string().optional(), // ví dụ: "PHYSICAL"
});

export type ReportProfit = z.infer<typeof ReportProfitSchema>;
