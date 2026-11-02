# Market Fliper — Deriv OAuth 2.0 / PKCE

Deploy-ready Next.js application for a Market Fliper web dashboard using Deriv's current OAuth 2.0 Authorization Code + PKCE flow.

## What is included

- Market Fliper landing page and existing dashboard/tool pages
- Current Deriv OAuth 2.0 login flow
- PKCE + state protection
- Server-side authorization-code exchange
- HttpOnly encrypted session cookie
- Deriv account discovery
- Demo/real account switching
- Authenticated WebSocket connection via Deriv OTP
- Live account balance subscription
- Logout/session handling
- Vercel/Next.js production configuration

## IMPORTANT: Deriv configuration

The old V1/legacy `oauth.deriv.com/oauth2/authorize` flow in the original project has been replaced. The current Deriv OAuth flow uses `https://auth.deriv.com/oauth2/auth`, an OAuth application/client ID, an exact HTTPS redirect URI, PKCE and a server-side code exchange.

For this deployment, the Deriv app ID and OAuth client ID are configured to use the same value. The supplied ID is the default; set `DERIV_CLIENT_ID` explicitly in Vercel if Deriv gave you a different OAuth client ID.

Register this exact callback URL in Deriv:

`https://marketflipperss.vercel.app/api/auth/callback`

Then set these environment variables in Vercel Project Settings:

- `DERIV_CLIENT_ID` — OAuth client ID; defaults to the same value as `DERIV_APP_ID`
- `DERIV_APP_ID` — `34ogXNoaMaOpCsqhQDaDS`
- `NEXT_PUBLIC_DERIV_APP_ID` — optional browser-side override; use the same app ID
- `DERIV_REDIRECT_URI` — `https://marketflipperss.vercel.app/api/auth/callback` (the app also accepts `DERIV_REDIRECT_URL` as an alias)
- `DERIV_OAUTH_SCOPE` — normally `trade` for this build
- `SESSION_SECRET` — **required** random 32+ character secret for encrypting the server-side login session

Never commit `.env.local` or put access tokens in client-side JavaScript.

## Vercel

Add the environment variables above to the Vercel project. Register the exact callback URL with the Deriv OAuth application.
After changing environment variables, redeploy the Vercel project so the running functions receive the new values.

## Expected login flow

Market Fliper → Login / Start Trading → Deriv login & consent → `/api/auth/callback` → server exchanges code → Market Fliper `/dashboard` → authenticated Deriv WebSocket.

## Trading safety

The UI pages from the original prototype contain some simulated/demo widgets. Authentication and the account connection are real, but a UI element should not be considered a live trading feature until it is explicitly wired to Deriv's proposal/buy/sell APIs.


## Final deployment checklist

1. Push this folder to GitHub.
2. Import this GitHub repository as a Vercel project.
3. Set `DERIV_CLIENT_ID`, `DERIV_APP_ID`, `DERIV_REDIRECT_URI`, `DERIV_OAUTH_SCOPE`, and `SESSION_SECRET` in Vercel Project Settings.
4. In the Deriv developer dashboard, use an **OAuth** application and register the exact `/api/auth/callback` URL.
5. Deploy and test Home → Start Trading → Deriv login/consent → Market Fliper dashboard.

No user access token or password is stored in this repository. Tokens are issued by Deriv during OAuth and kept server-side in an HttpOnly session cookie.
