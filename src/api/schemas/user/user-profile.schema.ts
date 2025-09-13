import { z } from 'zod';
import { baseTimeStampSchema } from '../common/base-timestamp.schema';
import { profileSchema } from './profile.schema';
import { roleEnumSchema } from './role';

export const userProfileSchema = z.object({
  id: z.uuid(),
  role: roleEnumSchema,
  is_active: z.boolean(),
  profile: profileSchema.optional(),
}).extend(baseTimeStampSchema.shape);

export type UserProfile = z.infer<typeof userProfileSchema>;
