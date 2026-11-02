import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function base64url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export async function GET(request) {
  const clientId = '34ogXNoaMaOpCsqhQDaDS';
  const redirectUri = 'https://marketflipperss.vercel.app';
  const scope = 'trade';

  const verifier = base64url(crypto.randomBytes(64));
  const state = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());

  const url = new URL('https://auth.deriv.com/oauth2/auth');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  const response = NextResponse.redirect(url);
  const secure = process.env.NODE_ENV === 'production';
  response.cookies.set('st_oauth_verifier', verifier, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 600 });
  response.cookies.set('st_oauth_state', state, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 600 });
  return response;
}
