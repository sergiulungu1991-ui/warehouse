import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/** Protect admin routes and redirect authenticated users away from /login */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
