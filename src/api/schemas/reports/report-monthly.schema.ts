import { z } from 'zod';

export const reportMonthlySalesSchema = z.object({
  month: z.string(),
  year: z.number().int().nonnegative(),
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
});

export type ReportMonthlySales = z.infer<typeof reportMonthlySalesSchema>;
