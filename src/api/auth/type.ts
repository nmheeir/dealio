import { z } from 'zod';

// Zod schemas for validation
export const LoginCredentialsSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const SignUpCredentialsSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/i, 'Mật khẩu phải chứa ít nhất một chữ cái')
    .regex(/\d/, 'Mật khẩu phải chứa ít nhất một chữ số'),
});

export const UserSchema = z.object({
  user_id: z.string(),
  // email: z.email(),
  fullname: z.string(),
  role: z.string().optional(),
  avatar_url: z.url().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  // user: UserSchema,
  // expires_in: z.number().optional(),
});

// TypeScript types derived from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type SignUpCredentials = z.infer<typeof SignUpCredentialsSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export type LoginResult = {
  statusCode: number;
  message: string;
};

export type RefreshTokenResponse = {
  access_token: string;
  expires_in?: number;
};

export type AuthContextType = {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
};

export type ApiError = {
  message: string;
  statusCode: number;
  error: string;
};
