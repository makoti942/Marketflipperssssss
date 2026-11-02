# Market Fliper — Deriv OAuth 2.0 / PKCE

Deploy-ready Next.js application for a Market Fliper web dashboard using Deriv's current OAuth 2.0 Authorization Code + PKCE flow.

## What is included

- Market Fliper landing page and existing dashboard/tool pages
- Current Deriv OAuth 2.0 login flow
- PKCE + state protection
- Server-side authorization-code exchange
- HttpOnly, Secure, SameSite session cookie
- Deriv account discovery
- Demo/real account switching
- Authenticated WebSocket connection via Deriv OTP
- Live account balance subscription
- Logout/session handling
- Vercel/Next.js production configuration

## IMPORTANT: Deriv configuration

The old V1/legacy `oauth.deriv.com/oauth2/authorize` flow in the original project has been replaced. The current Deriv OAuth flow uses `https://auth.deriv.com/oauth2/auth`, an OAuth application/client ID, an exact HTTPS redirect URI, PKCE and a server-side code exchange.

For this deployment, the Deriv app ID and OAuth client ID use the supplied value `34ogXNoaMaOpCsqhQDaDS`. The app also has the production callback URL built in, so no Vercel environment variables are required.

Register this exact callback URL in Deriv:

`https://marketflipperss.vercel.app/api/auth/callback`

Never commit `.env.local` or put access tokens in client-side JavaScript.

The session cookie is base64-encoded, not encrypted, because this deployment does not use a private server-side secret. It is marked `HttpOnly`, `Secure` in production, and `SameSite=Lax`; anyone who obtains the cookie can reuse the Deriv token until it expires. Do not share or expose cookie values.

## Vercel

No Vercel environment variables are required for the built-in app ID and callback. Register the exact callback URL with the Deriv OAuth application, then deploy the repository.

## Expected login flow

Market Fliper → Login / Start Trading → Deriv login & consent → `/api/auth/callback` → server exchanges code → Market Fliper `/dashboard` → authenticated Deriv WebSocket.

## Trading safety

The UI pages from the original prototype contain some simulated/demo widgets. Authentication and the account connection are real, but a UI element should not be considered a live trading feature until it is explicitly wired to Deriv's proposal/buy/sell APIs.


## Final deployment checklist

1. Push this folder to GitHub.
2. Import this GitHub repository as a Vercel project.
3. In the Deriv developer dashboard, use an **OAuth** application and register the exact `/api/auth/callback` URL.
4. Deploy and test Home → Start Trading → Deriv login/consent → Market Fliper dashboard.

No user access token or password is stored in this repository. Tokens are issued by Deriv during OAuth and held in an HttpOnly browser cookie until they expire.
