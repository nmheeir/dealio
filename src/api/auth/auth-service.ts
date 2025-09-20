/* eslint-disable no-console */
import type {
  LoginCredentials,
  LoginResult,
} from './type';
import axios from 'axios';
import Cookies from 'js-cookie';
import apiClient from '../common/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export class AuthService {
  // Login với validation
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    console.log('[authService.login] called with credentials:', credentials);

    try {
      const response = await authClient.post('/auth/login', credentials);
      console.log('[authService.login] raw response:', response);

      const response1 = {
        statusCode: response.status,
        message: response.data.message,
      };

      // Validate response với Zod
      console.log('[authService.login] response.data before validation:', response.data);

      return response1;
    } catch (error: any) {
      console.error('[authService.login] error object:', error);

      const errorMessage
      = error.response?.data?.message
        || error.message
        || 'Đăng nhập thất bại';

      console.error('[authService.login] error message:', errorMessage);

      return { statusCode: error.status, message: errorMessage };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const response = await authClient.get('/auth/logout');
      console.info(response);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  // TODO: fix check authenticated
  async checkAuthenticated(): Promise<boolean> {
    try {
      const response = await apiClient.get('/auth/role');
      if (response.data.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error: any) {
      console.log(error);

      if (error.response?.status === 401) {
        this.clearTokens();
      }
      return false;
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

  private clearTokens(): void {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  // Public getters
  isAuthenticated(): boolean {
    return !!Cookies.get('access_token');
  }

  getAccessToken(): string | undefined {
    const token = Cookies.get('access_token');
    console.log('[authservice.getAccessToken]: ', token);

    return token;
  }

  getRefreshToken(): string | undefined {
    return Cookies.get('refresh_token');
  }
}

export const authService = new AuthService();
