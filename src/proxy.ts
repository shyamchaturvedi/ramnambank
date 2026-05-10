import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export async function proxy(request: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // 1. Session Check for Dashboard
  const { data: { session } } = await supabase.auth.getSession();

  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      console.log('Middleware: No session found, redirecting to /login');
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
      // Fail silently for maintenance
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
