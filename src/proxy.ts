import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We create a separate client for middleware to avoid issues with env vars in edge
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude dashboard, api, and static files from maintenance check
  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/maintenance') ||
    pathname.includes('.') // for images, favicons etc
  ) {
    return NextResponse.next();
  }

  try {
    // 2. Check maintenance mode from Supabase
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'maintenance_mode')
      .single();

    if (data && data.value === 'true') {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  } catch (e) {
    console.error('Middleware maintenance check failed:', e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
