import { z } from 'zod';

export const ReportYearlySchema = z.object({
  year: z.number().int().nonnegative(),
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
});

export type ReportYearly = z.infer<typeof ReportYearlySchema>;
