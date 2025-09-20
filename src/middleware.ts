import type { NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import apiClient from '@/api/common/client';
import arcjet from '@/libs/Arcjet';

import { routing } from './libs/I18nRouting';

// Khởi tạo cache với thời gian sống (TTL) là 5 phút
const roleCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const handleI18nRouting = createMiddleware(routing);

const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: [
      'CATEGORY:SEARCH_ENGINE',
      'CATEGORY:PREVIEW',
      'CATEGORY:MONITOR',
    ],
  }),
);

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  console.log('[MIDDLEWARE] pathname:', pathname, 'token:', token ? 'yes' : 'no');

  // Public routes
  const publicExactRoutes = ['/', '/monitoring'];
  const publicPrefixRoutes = [
    '/signin',
    '/signup',
    '/api',
    '/_next',
    '/static',
    '/search',
    '/product',
  ];

  const isPublicRoute
    = publicExactRoutes.includes(pathname)
      || publicPrefixRoutes.some(route => pathname.startsWith(route));

  console.log('[MIDDLEWARE] isPublicRoute:', isPublicRoute);

  // 🛑 Nếu không có token và không phải route công khai → redirect signin
  if (!token && !isPublicRoute) {
    console.log('[MIDDLEWARE] → Redirect /signin (chưa có token)');
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Nếu đã có token mà lại vào /signin hoặc /signup → redirect /
  if (token && ['/signin', '/signup'].some(route => pathname.startsWith(route))) {
    console.log('[MIDDLEWARE] → Redirect / (đã có token, chặn auth pages)');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 🔑 Nếu có token, check role
  if (token && !isPublicRoute) {
    try {
      const cacheKey = `role_${token}`;
      let userRole: string | undefined = roleCache.get(cacheKey);

      if (!userRole) {
        const response = await apiClient.get('auth/role', {
          headers: { Cookie: `access_token=${token}` },
        });
        userRole = response.data.data.role;
        if (userRole) {
          roleCache.set(cacheKey, userRole);
        }
      }

      console.log('[MIDDLEWARE] userRole:', userRole);

      if (!userRole || !['ADMIN', 'CUSTOMER', 'MANAGER'].includes(userRole)) {
        console.log('[MIDDLEWARE] → Invalid role, redirect signin');
        const loginUrl = new URL('/signin', request.url);
        loginUrl.searchParams.set('from', pathname);
        loginUrl.searchParams.set('error', 'invalid_role');
        return NextResponse.redirect(loginUrl);
      }

      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        console.log('[MIDDLEWARE] → Unauthorized (not admin)');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Error checking role:', error);
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  console.log('[MIDDLEWARE] → Pass through', pathname);
  return handleI18nRouting(request);
}

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
