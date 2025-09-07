import z from 'zod';

export const baseTimeStampSchema = z.object({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
