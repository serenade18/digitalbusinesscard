const REFRESH_TOKEN_KEY = 'dbc.refreshToken'

/**
 * The backend returns the refresh token in the JSON body (no httpOnly-cookie
 * flow is implemented server-side), so localStorage is the only place it can
 * live client-side. The access token never touches storage — it's kept in
 * memory only (see authSlice).
 */
export function storeRefreshToken(token: string) {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch {
    // Storage unavailable (private mode, blocked) — silent refresh just won't work.
  }
}

export function getStoredRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function clearStoredRefreshToken() {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    // ignore
  }
}
