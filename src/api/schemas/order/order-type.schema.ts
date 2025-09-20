import { z } from 'zod';

export const orderTypeSchema = z.enum(['PHYSICAL', 'DIGITAL']);

export type OrderType = z.infer<typeof orderTypeSchema>;
