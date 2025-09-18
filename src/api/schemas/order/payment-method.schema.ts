import z from 'zod';

export const paymentMethodSchema = z.enum([
  'MOMO_WALLET',
  'COD',
]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
