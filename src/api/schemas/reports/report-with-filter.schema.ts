import { z } from 'zod';

export const ReportWithFilterSchema = z.object({
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
  period: z.string(),
});

export type ReportWithFilter = z.infer<typeof ReportWithFilterSchema>;
