import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value
 
  // If trying to access auth pages while logged in
  if (token && (
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up')
  )) {
    return NextResponse.redirect(new URL('/', request.url))
  }
 
  return NextResponse.next()
}
 
// Configure which paths the middleware runs on
export const config = {
  matcher: ['/sign-in', '/sign-up']
}