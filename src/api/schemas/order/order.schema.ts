import { z } from 'zod';
import { orderAddressSchema } from './order-address.schema';
import { orderItemSchema } from './order-item.schema';
import { orderStatusSchema } from './order-status.schema';
import { OrderTypeSchema as orderTypeSchema } from './order-type.schema';

export const orderSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string(),
  order_code: z.string().nullable(),
  sub_total: z.number(),
  discount_amount: z.string(),
  shipping_fee: z.string(),
  total_amount: z.string(),
  status: orderStatusSchema,
  order_type: orderTypeSchema,
  expired_at: z.string(),
  cancelled_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable(),
  orderAddress: orderAddressSchema,
  orderItems: z.array(orderItemSchema),
});

export type Order = z.infer<typeof orderSchema>;
