import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';
import { profileSchema } from './profile.schema';
import { roleEnumSchema } from './role';

export const userSchema = z.object({
  id: z.uuid(),
  role: roleEnumSchema,
  is_active: z.boolean(),
  email: z.email(),
  profile: profileSchema.optional(),
}).extend(baseTimeStampSchema.shape);

export type User = z.infer<typeof userSchema>;
