import { z } from 'zod';

export const reportDateSalesSchema = z.object({
  date: z.iso.datetime(),
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProductsSold: z.number().int().nonnegative(),
});

export type ReportDateSales = z.infer<typeof reportDateSalesSchema>;
