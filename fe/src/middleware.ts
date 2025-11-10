import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { safeLog, DEBUG } from './lib/debug-config'

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

// Extract roles from token
function extractRoles(token: string): string[] {
  try {
    const decoded = decodeJWT(token);
    
    // Check scope field (can be string like "ROLE_ADMIN" or array)
    let roles = [];
    if (decoded?.scope) {
      if (typeof decoded.scope === 'string') {
        roles = decoded.scope.split(' ');
      } else {
        roles = [decoded.scope];
      }
    } else {
      roles = decoded?.roles || [];
    }
    
    return roles;
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error extracting roles:', error);
    return [];
  }
}

// Check if user is admin
function isAdmin(token: string): boolean {
  try {
    const roles = extractRoles(token);
    safeLog.middleware('🔍 [MIDDLEWARE] Extracted roles:', { roles }); // Safe - no sensitive data
    const adminRoles = ['ROLE_ADMIN', 'ADMIN'];
    const hasAdminRole = adminRoles.some(role => roles.includes(role));
    
    return hasAdminRole;
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error in isAdmin check:', error);
    return false;
  }
}

// Check if user is recruiter
function isRecruiter(token: string): boolean {
  try {
    const roles = extractRoles(token);
    const recruiterRoles = ['ROLE_RECRUITER', 'RECRUITER'];
    const hasRecruiterRole = recruiterRoles.some(role => roles.includes(role));
    
    return hasRecruiterRole;
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error in isRecruiter check:', error);
    return false;
  }
}

// Check if user is candidate
function isCandidate(token: string): boolean {
  try {
    const roles = extractRoles(token);
    const candidateRoles = ['ROLE_CANDIDATE', 'CANDIDATE'];
    const hasCandidateRole = candidateRoles.some(role => roles.includes(role));
    
    return hasCandidateRole;
  } catch (error) {
    safeLog.error('🔍 [MIDDLEWARE] Error in isCandidate check:', error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  // Get the refresh token from cookies (HTTP-only cookie)
  // Note: We can't access localStorage in middleware, so we'll use refresh token to check authentication
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // ⚠️ SECURITY: Never log cookie values - they contain tokens
  // OLD: Debug: Log all cookies
  if (DEBUG.MIDDLEWARE) {
    safeLog.middleware('🔍 [MIDDLEWARE] Cookies check:', { 
      hasCookies: request.cookies.size > 0,
      hasRefreshToken: !!refreshToken 
    });
  }

  // Handle auth pages (sign-in, sign-up)
  if (refreshToken) {
    try {
      const decoded = decodeJWT(refreshToken);

      // Check if refresh token is valid and not expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded && decoded.exp && decoded.exp > now) {
        // Refresh token is valid, user should be authenticated
        if (
          request.nextUrl.pathname.startsWith('/sign-in') ||
          request.nextUrl.pathname.startsWith('/sign-up')
        ) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      // Invalid token, allow access to auth pages
      safeLog.error('Invalid refresh token in middleware:', error);
    }
  }

  // Handle admin routes - Let client-side handle admin checks for now
  // The middleware will only check if user is authenticated
  if (request.nextUrl.pathname.startsWith('/admin')) {
    safeLog.middleware('🔍 [MIDDLEWARE] Admin route accessed:', { 
      path: request.nextUrl.pathname 
    });
    
    if (!refreshToken) {
      if (DEBUG.MIDDLEWARE) {
        safeLog.middleware('🔍 [MIDDLEWARE] No refresh token found, redirecting to sign-in', {});
      }
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
      const decoded = decodeJWT(refreshToken);
      // ⚠️ SECURITY: Never log decoded token - contains email in 'sub' field
      // OLD: console.log('🔍 [MIDDLEWARE] Decoded refresh token:', decoded);

      // Check if refresh token is valid and not expired
      const now = Math.floor(Date.now() / 1000);
      if (!decoded || !decoded.exp || decoded.exp <= now) {
        if (DEBUG.MIDDLEWARE) {
          safeLog.middleware('🔍 [MIDDLEWARE] Refresh token invalid or expired', {});
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // Check if user is admin based on refresh token
      const adminCheck = isAdmin(refreshToken);
      
      if (!adminCheck) {
        if (DEBUG.MIDDLEWARE) {
          safeLog.middleware('🔍 [MIDDLEWARE] User is not admin, redirecting to unauthorized', {});
        }
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (DEBUG.MIDDLEWARE) {
        safeLog.middleware('🔍 [MIDDLEWARE] Admin access granted', {});
      }
    } catch (error) {
      safeLog.error('🔍 [MIDDLEWARE] Error validating refresh token:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Handle recruiter routes - Only recruiters can access
  if (request.nextUrl.pathname.startsWith('/recruiter')) {
    safeLog.middleware('🔍 [MIDDLEWARE] Recruiter route accessed:', { 
      path: request.nextUrl.pathname 
    });
    
    if (!refreshToken) {
      if (DEBUG.MIDDLEWARE) {
        safeLog.middleware('🔍 [MIDDLEWARE] No refresh token found, redirecting to sign-in', {});
      }
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
      const decoded = decodeJWT(refreshToken);

      // Check if refresh token is valid and not expired
      const now = Math.floor(Date.now() / 1000);
      if (!decoded || !decoded.exp || decoded.exp <= now) {
        if (DEBUG.MIDDLEWARE) {
          safeLog.middleware('🔍 [MIDDLEWARE] Refresh token invalid or expired', {});
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // Check if user is recruiter
      const recruiterCheck = isRecruiter(refreshToken);
      
      if (!recruiterCheck) {
        if (DEBUG.MIDDLEWARE) {
          safeLog.middleware('🔍 [MIDDLEWARE] User is not recruiter, redirecting to unauthorized', {});
        }
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (DEBUG.MIDDLEWARE) {
        safeLog.middleware('🔍 [MIDDLEWARE] Recruiter access granted', {});
      }
    } catch (error) {
      safeLog.error('🔍 [MIDDLEWARE] Error validating refresh token:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Handle candidate routes - Only candidates can access
  if (request.nextUrl.pathname.startsWith('/candidate')) {
    safeLog.middleware('🔍 [MIDDLEWARE] Candidate route accessed:', { 
      path: request.nextUrl.pathname 
    });
    
    if (!refreshToken) {
      if (DEBUG.MIDDLEWARE) {
        safeLog.middleware('🔍 [MIDDLEWARE] No refresh token found, redirecting to sign-in', {});
      }
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
      const decoded = decodeJWT(refreshToken);

      // Check if refresh token is valid and not expired
      const now = Math.floor(Date.now() / 1000);
      if (!decoded || !decoded.exp || decoded.exp <= now) {
        if (DEBUG.MIDDLEWARE) {
          safeLog.middleware('🔍 [MIDDLEWARE] Refresh token invalid or expired', {});
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // Check if user is candidate
      const candidateCheck = isCandidate(refreshToken);
      
      if (!candidateCheck) {
        if (DEBUG.MIDDLEWARE) {
          safeLog.middleware('🔍 [MIDDLEWARE] User is not candidate, redirecting to unauthorized', {});
        }
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (DEBUG.MIDDLEWARE) {
        safeLog.middleware('🔍 [MIDDLEWARE] Candidate access granted', {});
      }
    } catch (error) {
      safeLog.error('🔍 [MIDDLEWARE] Error validating refresh token:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/sign-in', '/sign-up', '/admin/:path*', '/recruiter/:path*', '/candidate/:path*']
}