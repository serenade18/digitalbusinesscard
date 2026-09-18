import { baseApi } from '@/services/api'
import type { Paginated } from '@/types/common'
import type { Notification } from '@/types/notifications'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listNotifications: build.query<Paginated<Notification>, { is_read?: boolean } | void>({
      query: (params) => ({ url: '/notifications/', params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [...result.results.map((n) => ({ type: 'Notification' as const, id: n.id })), 'Notification']
          : ['Notification'],
    }),
    unreadNotificationCount: build.query<{ count: number }, void>({
      query: () => '/notifications/unread-count/',
      providesTags: ['Notification'],
    }),
    markNotificationRead: build.mutation<Notification, string>({
      query: (id) => ({ url: `/notifications/${id}/read/`, method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: build.mutation<{ detail: string }, void>({
      query: () => ({ url: '/notifications/mark-all-read/', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useListNotificationsQuery,
  useUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi
