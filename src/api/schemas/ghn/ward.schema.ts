import z from 'zod';

export const ghnWardSchema = z.object({
  WardCode: z.number(),
  WardName: z.string(),
  DistrictID: z.number(),
});

export type GhnWard = z.infer<typeof ghnWardSchema>;
