import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function base64url(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const cookieState =
    request.cookies.get('st_oauth_state')?.value;

  const verifier =
    request.cookies.get('st_oauth_verifier')?.value;

  /*
   * Always use the public Vercel URL for redirects.
   * Do NOT use request.url origin because proxies can
   * expose an internal localhost origin to the app.
   */
  const redirectUri = 'https://marketflipperss.vercel.app/';
  const publicOrigin = new URL(redirectUri).origin;

  /*
   * Deriv returned an OAuth error.
   */
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/callback?error=${encodeURIComponent(error)}`,
        publicOrigin
      )
    );
  }

  /*
   * Validate OAuth state.
   */
  if (
    !code ||
    !state ||
    !cookieState ||
    state !== cookieState
  ) {
    return NextResponse.redirect(
      new URL(
        '/callback?error=state_mismatch',
        publicOrigin
      )
    );
  }

  /*
   * PKCE verifier must exist.
   */
  if (!verifier) {
    return NextResponse.redirect(
      new URL(
        '/callback?error=missing_pkce_verifier',
        publicOrigin
      )
    );
  }

  const clientId = '34ogXNoaMaOpCsqhQDaDS';

  /*
   * Exchange the authorization code for tokens.
   */
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });

  try {
    const tokenResponse = await fetch(
      'https://auth.deriv.com/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
        body,
        cache: 'no-store',
      }
    );

    const token = await tokenResponse.json();

    if (
      !tokenResponse.ok ||
      !token.access_token
    ) {
      console.error(
        'Deriv token exchange failed:',
        tokenResponse.status,
        token.error ||
          token.errors ||
          'unknown'
      );

      return NextResponse.redirect(
        new URL(
          '/callback?error=token_exchange_failed',
          publicOrigin
        )
      );
    }

    /*
     * Create the server-side session data.
     */
    const session = {
      access_token: token.access_token,
      refresh_token:
        token.refresh_token || null,
      expires_at:
        Date.now() +
        Number(token.expires_in || 3600) *
          1000,
    };

    /*
     * IMPORTANT:
     * Redirect using the public Vercel origin,
     * never request.url origin.
     */
    const response =
      NextResponse.redirect(
        new URL(
          '/callback?success=1',
          publicOrigin
        )
      );

    // Base64 is only serialization, not encryption. Keep the bearer token
    // inaccessible to JavaScript and restrict cookie delivery to HTTPS.
    response.cookies.set(
      'st_session',
      Buffer.from(JSON.stringify(session), 'utf8').toString('base64url'),
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          'production',
        sameSite: 'lax',
        path: '/',
        maxAge: Math.max(
          300,
          Number(
            token.expires_in || 3600
          )
        ),
      }
    );

    /*
     * Remove temporary OAuth cookies.
     */
    response.cookies.delete(
      'st_oauth_state'
    );

    response.cookies.delete(
      'st_oauth_verifier'
    );

    return response;
  } catch (err) {
    console.error(
      'OAuth callback error:',
      err
    );

    return NextResponse.redirect(
      new URL(
        '/callback?error=callback_failed',
        publicOrigin
      )
    );
  }
}
