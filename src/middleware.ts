import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // 1. Prevent Clickjacking (Stops others from embedding your site in iframes)
  response.headers.set('X-Frame-Options', 'DENY');
  
  // 2. Prevent MIME-type sniffing (Stops browsers from misinterpreting file types)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // 3. Control Referrer info (Protects user privacy when clicking links)
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 4. Basic Permissions Policy (Restricts browser features like camera/mic access)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

// Apply this middleware to all routes
export const config = {
  matcher: '/:path*',
};