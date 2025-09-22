import { z } from 'zod';

export const ReportOverallSchema = z.object({
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
  period: z.string(),
});

export type ReportOverall = z.infer<typeof ReportOverallSchema>;
