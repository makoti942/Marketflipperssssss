export function getSession(request) {
  const raw = request.cookies.get('st_session')?.value;
  if (!raw) return null;
  try {
    // Base64 is transport encoding only, not encryption. The cookie is
    // HttpOnly/Secure/SameSite=Lax; treat its Deriv token as a bearer credential.
    const session = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (!session.access_token || Number(session.expires_at) <= Date.now()) return null;
    return session;
  } catch { return null; }
}

export function derivHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Deriv-App-ID': process.env.DERIV_APP_ID || '34ogXNoaMaOpCsqhQDaDS',
    'Content-Type': 'application/json',
  };
}
