import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'PENDING_CONFIRMATION',
  'PENDING_PAYMENT',
  'PAID',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELED',
  'FAILED',
  'RETURNED',
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
