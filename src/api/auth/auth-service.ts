/* eslint-disable no-console */
import type {
  LoginCredentials,
  LoginResult,
  User,
} from './type';
import axios from 'axios';
import Cookies from 'js-cookie';
import apiClient from '../common/client';
import {
  AuthResponseSchema,
  UserSchema,
} from './type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export class AuthService {
  // Login với validation
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    console.log('[authService.login] called with credentials:', credentials);

    try {
      const response = await authClient.post('/auth/login', credentials);
      console.log('[authService.login] raw response:', response);

      // Validate response với Zod
      console.log('[authService.login] response.data before validation:', response.data);
      const validatedData = AuthResponseSchema.parse(response.data.data);
      console.log('[authService.login] validatedData:', validatedData);

      const { access_token, refresh_token } = validatedData;

      // Lưu tokens với config bảo mật
      this.setTokens(access_token, refresh_token);
      console.log('[authService.login] tokens saved:', {
        access_token: !!access_token,
        refresh_token: !!refresh_token,
      });

      return { success: true };
    } catch (error: any) {
      console.error('[authService.login] error object:', error);

      const errorMessage
      = error.response?.data?.message
        || error.message
        || 'Đăng nhập thất bại';

      console.error('[authService.login] error message:', errorMessage);

      return { success: false, error: errorMessage };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const response = await authClient.post('/auth/logout');
      console.info(response);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Get current user với validation
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/profiles');
      return UserSchema.parse(response.data.data);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Refresh token manual
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token } = response.data;
      this.setAccessToken(access_token);

      return true;
    // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  async checkAuthenticated(): Promise<User | null> {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await apiClient.get('/profiles');
      const user = UserSchema.parse(response.data.data);
      return user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.clearTokens();
      }
      return null;
    }
  }

  // Token management utilities
  private setTokens(accessToken: string, refreshToken: string): void {
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    Cookies.set('access_token', accessToken, {
      expires: 1, // 1 day
      ...cookieOptions,
    });

    Cookies.set('refresh_token', refreshToken, {
      expires: 7, // 7 days
      ...cookieOptions,
    });
  }

  private setAccessToken(accessToken: string): void {
    Cookies.set('access_token', accessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  private clearTokens(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  // Public getters
  isAuthenticated(): boolean {
    return !!Cookies.get('access_token');
  }

  getAccessToken(): string | undefined {
    return Cookies.get('access_token');
  }

  getRefreshToken(): string | undefined {
    return Cookies.get('refresh_token');
  }
}

export const authService = new AuthService();
