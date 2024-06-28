import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { DEFAULT_REDIRECT, LOGIN } from './lib';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAuntenticated = !!req.auth;
  const isLoginPage = LOGIN.includes(nextUrl.pathname);

  const sensitiveRoutes = DEFAULT_REDIRECT;
  const isAccessingSensitiveRoute = sensitiveRoutes.includes(nextUrl.pathname);

  if (isLoginPage) {
    if (isAuntenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  if (!isAuntenticated && isAccessingSensitiveRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
