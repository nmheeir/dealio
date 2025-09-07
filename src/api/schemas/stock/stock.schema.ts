import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';

export const stockSchema = z.object({
  id: z.string(),
  quantity: z.number().int().nonnegative(),
  reserved: z.number().int().nonnegative(),
}).extend(baseTimeStampSchema);

export type Stock = z.infer<typeof stockSchema>;
