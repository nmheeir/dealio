import { z } from 'zod';

export const ReportByUserSchema = z.object({
  customerId: z.uuid(),
  customerName: z.string(),
  customerEmail: z.email(),
  totalOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  avgOrderValue: z.number().nonnegative(),
  firstOrderDate: z.iso.datetime(),
  lastOrderDate: z.iso.datetime(),
});

export type ReportByUser = z.infer<typeof ReportByUserSchema>;
