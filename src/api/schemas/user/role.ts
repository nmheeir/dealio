import z from 'zod';

export const roleEnumSchema = z.enum(['CUSTOMER', 'ADMIN', 'MANAGER']);
export type UserRole = z.infer<typeof roleEnumSchema>;
