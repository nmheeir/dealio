import z from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';
import { orderSchema } from '../order/order.schema';
import { userSchema } from '../user/user.schema';

export const refundRequestSchema = z.object({
  id: z.uuid(),
  reason: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  reviewNotes: z.string().nullable(),
  reviewedAt: z.iso.datetime().nullable(),
  finalizedAt: z.iso.datetime().nullable(),
  order: orderSchema.optional(),
  user: userSchema.optional(),
}).extend(baseTimeStampSchema.shape);

export type RefundRequest = z.infer<typeof refundRequestSchema>;
