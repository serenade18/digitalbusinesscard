import { baseApi } from '@/services/api'
import type { Paginated } from '@/types/common'
import type { VCard, VCardCreatePayload, VCardListItem, VCardUpdatePayload } from '@/types/cards'
import { hasFile, toFormData } from '@/services/uploads'

function cardBody(body: VCardCreatePayload | VCardUpdatePayload) {
  return hasFile(body) ? toFormData(body) : body
}

export const cardsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCards: build.query<Paginated<VCardListItem>, { page?: number } | void>({
      query: (params) => ({ url: '/vcards/', params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [...result.results.map((c) => ({ type: 'VCard' as const, id: c.id })), 'VCard']
          : ['VCard'],
    }),
    getCard: build.query<VCard, string>({
      query: (id) => `/vcards/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'VCard', id }],
    }),
    createCard: build.mutation<VCard, VCardCreatePayload>({
      query: (body) => ({ url: '/vcards/', method: 'POST', body: cardBody(body) }),
      invalidatesTags: ['VCard'],
    }),
    updateCard: build.mutation<VCard, { id: string; body: VCardUpdatePayload }>({
      query: ({ id, body }) => ({ url: `/vcards/${id}/`, method: 'PATCH', body: cardBody(body) }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'VCard', id }],
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          cardsApi.util.updateQueryData('getCard', id, (draft) => {
            Object.assign(draft, body)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    deleteCard: build.mutation<void, string>({
      query: (id) => ({ url: `/vcards/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['VCard'],
    }),
    publishCard: build.mutation<VCard, string>({
      query: (id) => ({ url: `/vcards/${id}/publish/`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'VCard', id }],
    }),
    unpublishCard: build.mutation<VCard, string>({
      query: (id) => ({ url: `/vcards/${id}/unpublish/`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'VCard', id }],
    }),
    assignCard: build.mutation<VCard, { id: string; userId: string }>({
      query: ({ id, userId }) => ({ url: `/vcards/${id}/assign/`, method: 'POST', body: { user_id: userId } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'VCard', id }],
    }),
    unassignCard: build.mutation<VCard, string>({
      query: (id) => ({ url: `/vcards/${id}/unassign/`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'VCard', id }],
    }),
    getCardQr: build.query<string, { id: string; format?: 'png' | 'svg' | 'pdf' }>({
      query: ({ id, format }) => ({
        url: `/vcards/${id}/qr/`,
        params: format ? { format } : undefined,
        responseHandler: (response: Response) => response.blob(),
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
    }),
    getCardVcf: build.query<string, string>({
      query: (id) => ({
        url: `/vcards/${id}/contact/`,
        responseHandler: (response: Response) => response.blob(),
      }),
      transformResponse: (blob: Blob) => URL.createObjectURL(blob),
    }),
  }),
})

export const {
  useListCardsQuery,
  useGetCardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
  usePublishCardMutation,
  useUnpublishCardMutation,
  useAssignCardMutation,
  useUnassignCardMutation,
  useLazyGetCardQrQuery,
  useLazyGetCardVcfQuery,
} = cardsApi
