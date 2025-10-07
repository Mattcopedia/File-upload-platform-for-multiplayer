import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { APP_ROUTES, publicPaths } from '@/constants';

// Secret used by NextAuth.js to encrypt tokens
const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req: req, secret });
  const isAuthenticated = !!token;
  const currentPath = req.nextUrl.pathname;
  const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path));

  // when logged in redirect users away from /auth to /dashboard
  if (isPublicPath) {
    if (isAuthenticated) {
      const uploadFileUrl = new URL(APP_ROUTES.UPLOAD_FILE, req.url);
      return NextResponse.redirect(uploadFileUrl);
    }
    // Allow access to public paths for non-authenticated users
    return NextResponse.next();
  }

  // when not logged in redirect users to /auth
  if (!isAuthenticated) {
    // Store the original URL they were trying to access
    const url = new URL(APP_ROUTES.AUTH_LOGIN, req.url);
    url.searchParams.set('callbackUrl', encodeURI(req.nextUrl.pathname));

    return NextResponse.redirect(url);
  }

  // Allow access to the rest of the routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|.well-known|favicon.ico|error|utilities-restricted|icon.png|sitemap.xml|robots.txt).*)',
  ],
};
