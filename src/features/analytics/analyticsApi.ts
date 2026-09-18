import { baseApi } from '@/services/api'
import type { AnalyticsPeriod, AnalyticsResponse } from '@/types/analytics'

export interface AnalyticsQueryArgs {
  vcard: string
  period?: AnalyticsPeriod
  start?: string
  end?: string
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalytics: build.query<AnalyticsResponse, AnalyticsQueryArgs>({
      query: ({ vcard, period, start, end }) => ({
        url: '/analytics/',
        params: { vcard, period, start, end },
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Analytics', id: arg.vcard }],
    }),
  }),
})

export const { useGetAnalyticsQuery } = analyticsApi
