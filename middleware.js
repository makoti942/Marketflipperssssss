import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const isOAuthResponse =
    url.searchParams.has('code') || url.searchParams.has('error');

  if (url.pathname === '/' && isOAuthResponse) {
    url.pathname = '/api/auth/callback';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
