import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import { authTokenRefreshed, loggedOut } from '@/features/auth/authSlice'
import { getStoredRefreshToken, storeRefreshToken } from '@/services/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

let refreshPromise: Promise<string | null> | null = null

async function performRefresh(
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<string | null> {
  const refresh = getStoredRefreshToken()
  if (!refresh) return null

  const refreshResult = await rawBaseQuery(
    { url: '/auth/refresh/', method: 'POST', body: { refresh } },
    api,
    extraOptions,
  )

  if (refreshResult.data) {
    const data = refreshResult.data as { access: string; refresh?: string }
    if (data.refresh) storeRefreshToken(data.refresh)
    api.dispatch(authTokenRefreshed({ accessToken: data.access }))
    return data.access
  }
  return null
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  const url = typeof args === 'string' ? args : args.url
  const isAuthEndpoint = url.startsWith('/auth/login') || url.startsWith('/auth/refresh') || url.startsWith('/auth/register')

  if (result.error?.status === 401 && !isAuthEndpoint) {
    if (!refreshPromise) {
      refreshPromise = performRefresh(api, extraOptions).finally(() => {
        refreshPromise = null
      })
    }
    const newAccess = await refreshPromise

    if (newAccess) {
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(loggedOut())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Me',
    'VCard',
    'Block',
    'Link',
    'Service',
    'Product',
    'Testimonial',
    'GalleryItem',
    'Template',
    'Organization',
    'Member',
    'Subscription',
    'Plan',
    'Invoice',
    'Order',
    'NfcCard',
    'Enquiry',
    'Appointment',
    'AppointmentService',
    'AvailabilityRule',
    'Notification',
    'DirectoryVisibility',
    'Analytics',
  ],
  endpoints: () => ({}),
})
