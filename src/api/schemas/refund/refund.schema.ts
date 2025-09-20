import z from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';
import { orderStatusSchema } from '../order/order-status.schema';
import { orderTypeSchema } from '../order/order-type.schema';
import { paymentMethodSchema } from '../order/payment-method.schema';

const orderSchema = z.object({
  id: z.uuid(),
  order_code: z.string().nullable(),
  sub_total: z.number(),
  discount_amount: z.string(),
  shipping_fee: z.string(),
  total_amount: z.string(),
  status: orderStatusSchema,
  order_type: orderTypeSchema,
  payment_method: paymentMethodSchema,
  expired_at: z.iso.datetime().nullable(),
  cancelled_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable(),
}).extend(baseTimeStampSchema.shape);

export const refundSchema = z.object({
  id: z.uuid(),
  reason: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED']),
  reviewNotes: z.string().nullable(),
  reviewedAt: z.iso.datetime().nullable(),
  finalizedAt: z.iso.datetime().nullable(),
  amount: z.number().optional(),
  order: orderSchema,
}).extend(baseTimeStampSchema.shape);

export type Refund = z.infer<typeof refundSchema>;
