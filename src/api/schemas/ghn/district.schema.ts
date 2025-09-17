import z from 'zod';

export const ghnDistrictSchema = z.object({
  DistrictID: z.number(),
  DistrictName: z.string(),
  ProvinceID: z.number(),
});

export type GhnDistrict = z.infer<typeof ghnDistrictSchema>;
