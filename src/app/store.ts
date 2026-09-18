import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/services/api'
import authReducer from '@/features/auth/authSlice'
import activeOrgReducer from '@/features/organizations/activeOrgSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activeOrg: activeOrgReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
