import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';
import { orderSchema } from '../order/order.schema';
import { userSchema } from '../user/user.schema';

export const refundRequestSchema = z.object({
  id: z.uuid(),
  reason: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
  reviewNotes: z.string().nullable(),
  reviewedAt: z.coerce.date().nullable(),
  finalizedAt: z.coerce.date().nullable(),
  order: orderSchema.optional(),
  user: userSchema.optional(),
  reviewedBy: userSchema.optional().nullable(),
  finalizedBy: userSchema.optional().nullable(),
}).extend(baseTimeStampSchema.shape);

export type RefundRequest = z.infer<typeof refundRequestSchema>;
