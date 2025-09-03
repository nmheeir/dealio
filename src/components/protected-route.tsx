'use client';

import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import { useAuth } from '@/api/auth/auth-context';

type ProtectedRouteProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: string;
};

// Loading component
function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      <span className="ml-2 text-gray-600">Đang xác thực...</span>
    </div>
  );
}

const defaultFallback = <AuthLoading />;

export default function ProtectedRoute({
  children,
  fallback = defaultFallback,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return fallback;
  }

  if (!isAuthenticated) {
    redirect('/signin');
  }

  if (requiredRole && user?.role !== requiredRole) {
    redirect('/unauthorized');
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
}
