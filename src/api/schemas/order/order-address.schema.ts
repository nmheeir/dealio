import z from 'zod';

export const orderAddressSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string(),
  to_name: z.string(),
  to_phone: z.string(),
  to_address: z.string(),
  to_ward_code: z.string(),
  to_district_id: z.number(),
  to_province_name: z.string(),
});

export type OrderAddress = z.infer<typeof orderAddressSchema>;
