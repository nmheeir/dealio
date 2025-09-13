import z from 'zod';

export const profileSchema = z.object({
  fullname: z.string(),
  avatar_url: z.url().nullable(),
});

export type Profile = z.infer<typeof profileSchema>;
