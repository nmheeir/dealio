import z from 'zod';

export const ghnProvinceSchema = z.object({
  ProvinceID: z.number(),
  ProvinceName: z.string(),
});

export type GhnProvince = z.infer<typeof ghnProvinceSchema>;
