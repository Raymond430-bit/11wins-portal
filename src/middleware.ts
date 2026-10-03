import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ==========================================
  // 1. SECURITY HEADERS
  // ==========================================
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // ==========================================
  // 2. IGNORE ADMIN, API, AND STATIC ASSETS
  // ==========================================
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') 
  ) {
    return response;
  }

  // ==========================================
  // 3. MAINTENANCE MODE CHECK & TRACKING
  // ==========================================
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      // Check if maintenance is on
      const settingsRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=is_maintenance_mode,maintenance_message`, {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        cache: 'no-store' 
      });
      
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        const isMaintenance = settings[0]?.is_maintenance_mode;

        if (isMaintenance) {
          const maintenanceUrl = new URL('/maintenance', request.url);
          maintenanceUrl.searchParams.set('msg', settings[0]?.maintenance_message || 'Site is under maintenance.');
          
          // Create the redirect response and add NO-CACHE headers
          const redirectResponse = NextResponse.redirect(maintenanceUrl);
          redirectResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
          return redirectResponse;
        }
      }

      // Track the visitor (Fire & Forget)
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ip,
          user_agent: userAgent,
          visited_path: pathname,
        }),
      }).catch(err => console.error('Tracking error:', err));

    } catch (error) {
      console.error('Middleware settings fetch error:', error);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|admin|api).*)'],
};