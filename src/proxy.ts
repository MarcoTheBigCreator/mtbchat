import { auth } from './auth.config';
import { DEFAULT_REDIRECT, LOGIN } from './lib/page-routes';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth?.user?.id;
  const isLoginPage = pathname === LOGIN;
  const isDashboard =
    pathname === DEFAULT_REDIRECT ||
    pathname.startsWith(`${DEFAULT_REDIRECT}/`);

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, req.url));
  }

  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};
