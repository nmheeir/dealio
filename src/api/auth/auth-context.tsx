/* eslint-disable no-console */
'use client';

import type { ReactNode } from 'react';
import type { AuthContextType, LoginCredentials, LoginResult, User } from './type';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { use } from 'react';
import { authService } from './auth-service';

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode; initialUser?: User | null };

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['auth/role'],
    queryFn: () => authService.checkAuthenticated(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isAuthenticated = data ?? false;

  const login = React.useCallback(
    async (credentials: LoginCredentials): Promise<LoginResult> => {
      console.log('[AuthProvider] login called with:', credentials);
      try {
        const result = await authService.login(credentials);
        console.log('[AuthProvider] login result:', result);
        if (result.statusCode === 201) {
          await queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
        return result;
      } catch (err) {
        console.error('[AuthProvider] login error:', err);
        throw err;
      }
    },
    [],
  );

  const logout = React.useCallback(
    async (): Promise<void> => {
      console.log('[AuthProvider] logout called');
      try {
        await authService.logout();
        console.log('[AuthProvider] logout success');
      } catch (err) {
        console.error('[AuthProvider] logout error:', err);
      }
      queryClient.removeQueries({ queryKey: ['profiles'] });
      router.replace('/signin');
      router.refresh();
    },
    [router, queryClient],
  );

  const value = React.useMemo<AuthContextType>(() => {
    return {
      login,
      logout,
      loading: isLoading,
      isAuthenticated,
    };
  }, [isLoading, login, logout, isAuthenticated]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

// Updated hook with better error handling
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = use(AuthContext); // React 19's use() hook
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  // console.log('[useAuth] context value:', context);
  return context;
};
