import { z } from 'zod';

export const OrderTypeSchema = z.enum(['PHYSICAL', 'DIGITAL']);

export type OrderType = z.infer<typeof OrderTypeSchema>;
