import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Session Check for Dashboard
  const sessionToken = request.cookies.get('sb-access-token')?.value || 
                       request.cookies.get('supabase-auth-token')?.value;

  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Maintenance Check (excluding dashboard and essential paths)
  if (
    !pathname.startsWith('/dashboard') && 
    !pathname.startsWith('/api') && 
    !pathname.startsWith('/_next') && 
    !pathname.startsWith('/maintenance') &&
    !pathname.includes('.')
  ) {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

      if (data && data.value === 'true') {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    } catch (e) {
      // Fail silently for maintenance to avoid breaking the site on DB hiccups
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
