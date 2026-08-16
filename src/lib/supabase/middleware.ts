import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const ADMIN_PATHS = ['/admin', '/dashboard'];
const PROTECTED_STARTS = ['/admin/', '/dashboard/', '/items', '/categories', '/rentals'];

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options as CookieOptions);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected =
    ADMIN_PATHS.includes(request.nextUrl.pathname) ||
    PROTECTED_STARTS.some((path) => request.nextUrl.pathname.startsWith(path));
  const isLogin = request.nextUrl.pathname === '/login';
  const isRoot = request.nextUrl.pathname === '/';

  if (isRoot) {
    const url = request.nextUrl.clone();
    url.pathname = user ? '/admin/items' : '/login';
    return NextResponse.redirect(url);
  }

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/items';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
