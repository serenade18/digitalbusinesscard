import { baseApi } from '@/services/api'
import { unwrapResults } from '@/lib/pagination'
import type { NfcCard } from '@/types/nfc'

export const nfcApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listNfcCards: build.query<NfcCard[], void>({
      query: () => '/nfc/',
      transformResponse: unwrapResults<NfcCard>,
      providesTags: (result) =>
        result ? [...result.map((c) => ({ type: 'NfcCard' as const, id: c.id })), 'NfcCard'] : ['NfcCard'],
    }),
    assignNfcCard: build.mutation<NfcCard, { id: string; vcardId: string }>({
      query: ({ id, vcardId }) => ({ url: `/nfc/${id}/assign/`, method: 'POST', body: { vcard_id: vcardId } }),
      invalidatesTags: ['NfcCard'],
    }),
    reassignNfcCard: build.mutation<NfcCard, { id: string; vcardId: string }>({
      query: ({ id, vcardId }) => ({ url: `/nfc/${id}/reassign/`, method: 'POST', body: { vcard_id: vcardId } }),
      invalidatesTags: ['NfcCard'],
    }),
    getNfcWriteInstructions: build.query<Record<string, unknown>, string>({
      query: (id) => `/nfc/${id}/write-instructions/`,
    }),
  }),
})

export const {
  useListNfcCardsQuery,
  useAssignNfcCardMutation,
  useReassignNfcCardMutation,
  useLazyGetNfcWriteInstructionsQuery,
} = nfcApi
