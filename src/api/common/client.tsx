/* eslint-disable no-console */
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError, RefreshTokenResponse } from '../auth/type';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Token refresh utility
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Request interceptor - Modern approach
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor với queue mechanism
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[API SUCCESS]', response.config.url, response.status, response.data);
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    console.error('[API ERROR]', error.config?.url, error.response?.status, error.response?.data);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401
      && originalRequest
      && !originalRequest._retry
    ) {
      console.warn('[INTERCEPTOR] 401 detected, handling refresh flow...');

      if (isRefreshing) {
        console.log('[INTERCEPTOR] Refresh already in progress, queuing request:', originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log('[INTERCEPTOR] Retrying queued request with new token:', originalRequest.url);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            console.error('[INTERCEPTOR] Queued request failed:', err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');
      console.log('[INTERCEPTOR] Found refresh token:', refreshToken);

      if (!refreshToken) {
        console.warn('[INTERCEPTOR] No refresh token, redirecting to /signin');
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        console.log('[INTERCEPTOR] Requesting new access token...');
        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        console.log('[INTERCEPTOR] Refresh response:', response.data);

        const { access_token, expires_in } = response.data;

        // Save new token
        Cookies.set('access_token', access_token, {
          expires: expires_in ? expires_in / 86400 : 1, // Convert seconds to days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        console.log('[INTERCEPTOR] Saved new access token:', access_token);

        processQueue(null, access_token);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        console.log('[INTERCEPTOR] Retrying original request:', originalRequest.url);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[INTERCEPTOR] Refresh failed:', refreshError);

        processQueue(refreshError, null);

        // Clear tokens and redirect
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');

        if (typeof window !== 'undefined') {
          // window.location.href = '/signin';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        console.log('[INTERCEPTOR] Refresh process finished');
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
