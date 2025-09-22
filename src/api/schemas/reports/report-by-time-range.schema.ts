import { z } from 'zod';

export const ReportByTimeRangeSchema = z.object({
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  period: z.string(),
});

export type ReportByTimeRange = z.infer<typeof ReportByTimeRangeSchema>;
