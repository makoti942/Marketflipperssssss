# Star Traders — Deriv OAuth 2.0 / PKCE

Deploy-ready Next.js application for a Star Traders web dashboard using Deriv's current OAuth 2.0 Authorization Code + PKCE flow.

## What is included

- Star Traders landing page and existing dashboard/tool pages
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

Create an OAuth application in the Deriv developer dashboard. `DERIV_CLIENT_ID` is the OAuth client ID; it is separate from the Deriv app ID below.

Register this exact callback URL in Deriv:

`https://marketflipperss.vercel.app/api/auth/callback`

Then set these environment variables in Vercel Project Settings:

- `DERIV_CLIENT_ID` — OAuth application's client ID
- `DERIV_APP_ID` — `34ogXNoaMaOpCsqhQDaDS`
- `NEXT_PUBLIC_DERIV_APP_ID` — optional browser-side override; use the same app ID
- `DERIV_REDIRECT_URI` — `https://marketflipperss.vercel.app/api/auth/callback`
- `DERIV_OAUTH_SCOPE` — normally `trade` for this build
- `SESSION_SECRET` — random 32+ character secret

Never commit `.env.local` or put access tokens in client-side JavaScript.

## Vercel

Add the environment variables above to the Vercel project. Register the exact callback URL with the Deriv OAuth application.

## Expected login flow

Star Traders → Login / Start Trading → Deriv login & consent → `/api/auth/callback` → server exchanges code → Star Traders `/dashboard` → authenticated Deriv WebSocket.

## Trading safety

The UI pages from the original prototype contain some simulated/demo widgets. Authentication and the account connection are real, but a UI element should not be considered a live trading feature until it is explicitly wired to Deriv's proposal/buy/sell APIs.


## Final deployment checklist

1. Push this folder to GitHub.
2. Import this GitHub repository as a Vercel project.
3. Set `DERIV_CLIENT_ID`, `DERIV_APP_ID`, `DERIV_REDIRECT_URI`, `DERIV_OAUTH_SCOPE`, and `SESSION_SECRET` in Vercel Project Settings.
4. In the Deriv developer dashboard, use an **OAuth** application and register the exact `/api/auth/callback` URL.
5. Deploy and test Home → Start Trading → Deriv login/consent → Star Traders dashboard.

No user access token or password is stored in this repository. Tokens are issued by Deriv during OAuth and kept server-side in an HttpOnly session cookie.
