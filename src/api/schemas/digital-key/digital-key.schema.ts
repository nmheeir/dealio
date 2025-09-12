import z from 'zod';

export const digitalKeySchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  hash_key_code: z.string().length(64, 'Hash phải là SHA-256 hex'),
  key_code: z.string().min(10, 'Key code quá ngắn'),
  status: z.enum(['UNUSED', 'USED', 'EXPIRED', 'REVOKED']),
  active_at: z.iso.datetime().nullable(),
});

export type DigitalKey = z.infer<typeof digitalKeySchema>;
