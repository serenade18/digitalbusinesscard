import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/auth'
import { clearStoredRefreshToken } from '@/services/auth'

export type AuthStatus = 'hydrating' | 'authenticated' | 'anonymous'

interface AuthState {
  accessToken: string | null
  user: User | null
  status: AuthStatus
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  status: 'hydrating',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsReceived(state, action: PayloadAction<{ accessToken: string; user: User }>) {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.status = 'authenticated'
    },
    authTokenRefreshed(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken
      state.status = 'authenticated'
    },
    userUpdated(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    hydrationFinished(state, action: PayloadAction<{ user: User } | null>) {
      if (action.payload) {
        state.user = action.payload.user
        state.status = 'authenticated'
      } else {
        state.status = 'anonymous'
      }
    },
    loggedOut(state) {
      state.accessToken = null
      state.user = null
      state.status = 'anonymous'
      clearStoredRefreshToken()
    },
  },
})

export const { credentialsReceived, authTokenRefreshed, userUpdated, hydrationFinished, loggedOut } =
  authSlice.actions
export default authSlice.reducer
