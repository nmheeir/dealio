import z from 'zod';

export const refundSchema = z.object({
  orderId: z.string(),
});

export type Refund = z.infer<typeof refundSchema>;
