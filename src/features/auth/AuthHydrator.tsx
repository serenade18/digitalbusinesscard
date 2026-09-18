import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { authTokenRefreshed, hydrationFinished } from '@/features/auth/authSlice'
import { useLazyMeQuery, useRefreshTokenMutation } from '@/features/auth/authApi'
import { clearStoredRefreshToken, getStoredRefreshToken, storeRefreshToken } from '@/services/auth'

/**
 * Runs once on app boot. The access token only ever lives in memory, so on a
 * hard refresh we have nothing but a (possibly stale) refresh token in
 * localStorage — exchange it for a fresh access token, then hydrate the user
 * via /auth/me/. Anything failing here just means "not logged in".
 */
export function AuthHydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const [refreshToken] = useRefreshTokenMutation()
  const [fetchMe] = useLazyMeQuery()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function hydrate() {
      const refresh = getStoredRefreshToken()
      if (!refresh) {
        dispatch(hydrationFinished(null))
        return
      }

      try {
        const tokens = await refreshToken({ refresh }).unwrap()
        if (tokens.refresh) storeRefreshToken(tokens.refresh)
        dispatch(authTokenRefreshed({ accessToken: tokens.access }))

        const user = await fetchMe().unwrap()
        dispatch(hydrationFinished({ user }))
      } catch {
        clearStoredRefreshToken()
        dispatch(hydrationFinished(null))
      }
    }

    void hydrate()
  }, [dispatch, refreshToken, fetchMe])

  return children
}
