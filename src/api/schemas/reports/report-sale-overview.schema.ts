import { z } from 'zod';

export const reportSalesOverviewData = z.object({
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
  period: z.string(),
});

export type ReportSalesOverviewData = z.infer<typeof reportSalesOverviewData>;
