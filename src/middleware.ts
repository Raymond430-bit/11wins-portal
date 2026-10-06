import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

// Clean the URL to prevent double slashes
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Notice we added `event: NextFetchEvent` here
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. SECURITY HEADERS
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 2. IGNORE ADMIN, API, AND STATIC ASSETS
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') 
  ) {
    return response;
  }

  // 3. CHECK IF WE HAVE THE KEYS
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ Middleware: Missing Supabase URL or Service Role Key!');
    return response; 
  }

  // 4. MAINTENANCE MODE & TRACKING
  try {
    // Fetch settings (blocking, so it MUST finish before sending the page)
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
        const redirectResponse = NextResponse.redirect(maintenanceUrl);
        redirectResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        return redirectResponse;
      }
    } else {
      console.error('❌ Middleware: Failed to fetch settings. Status:', settingsRes.status);
    }

    // Track the visitor
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // THE MAGIC FIX: event.waitUntil keeps the Edge function alive to finish the insert!
    event.waitUntil(
      fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal' 
        },
        body: JSON.stringify({
          ip_address: ip,
          user_agent: userAgent,
          visited_path: pathname,
        }),
      }).catch(err => console.error('❌ Middleware: Tracking insert failed:', err))
    );

  } catch (error) {
    console.error('❌ Middleware: Fatal error:', error);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|admin|api).*)'],
};