/**
 * Decode JWT token and extract expiration time
 * @param token JWT token string
 * @returns expiration timestamp in milliseconds or null if invalid
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
}

/**
 * Check if token is expired or will expire within buffer time
 * @param token JWT token string
 * @param bufferSeconds Buffer time in seconds (default 60s)
 * @returns true if token is expired or will expire soon
 */
export function isTokenExpired(token: string, bufferSeconds: number = 300): boolean {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  const now = Date.now();
  const bufferTime = bufferSeconds * 1000;

  return now >= expiration - bufferTime;
}
