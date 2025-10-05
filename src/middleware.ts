import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple JWT decode function for middleware
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Check if user is admin
function isAdmin(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    const roles = decoded?.scope ? [decoded.scope] : decoded?.roles || [];
    const adminRoles = ['ROLE_ADMIN', 'ADMIN'];
    return adminRoles.some(role => roles.includes(role));
  } catch (error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // Handle auth pages (sign-in, sign-up)
  if (token) {
    try {
      const decoded = decodeJWT(token);

      // Check if token is valid and not expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded && decoded.exp && decoded.exp > now) {
        // Token is valid and not expired
        if (
          request.nextUrl.pathname.startsWith('/sign-in') ||
          request.nextUrl.pathname.startsWith('/sign-up')
        ) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      // Invalid token, allow access to auth pages
      console.log('Invalid token in middleware:', error);
    }
  }

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      // No token, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
      const decoded = decodeJWT(token);

      // Check if token is valid and not expired
      const now = Math.floor(Date.now() / 1000);
      if (!decoded || !decoded.exp || decoded.exp <= now) {
        // Token is invalid or expired, redirect to sign-in
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // Check if user is admin
      if (!isAdmin(token)) {
        // Not an admin, redirect to home with error
        const url = new URL('/', request.url);
        url.searchParams.set('error', 'admin_access_denied');
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Invalid token, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/sign-in', '/sign-up', '/admin/:path*']
}