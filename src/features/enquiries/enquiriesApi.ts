import { baseApi } from '@/services/api'
import type { Paginated } from '@/types/common'
import type { Enquiry, EnquiryStatus } from '@/types/enquiries'

export const enquiriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listEnquiries: build.query<Paginated<Enquiry>, { vcard?: string; status?: EnquiryStatus } | void>({
      query: (params) => ({ url: '/enquiries/', params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [...result.results.map((e) => ({ type: 'Enquiry' as const, id: e.id })), 'Enquiry']
          : ['Enquiry'],
    }),
    updateEnquiryStatus: build.mutation<Enquiry, { id: string; status: EnquiryStatus }>({
      query: ({ id, status }) => ({ url: `/enquiries/${id}/`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Enquiry', id }],
    }),
    deleteEnquiry: build.mutation<void, string>({
      query: (id) => ({ url: `/enquiries/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Enquiry'],
    }),
  }),
})

export const { useListEnquiriesQuery, useUpdateEnquiryStatusMutation, useDeleteEnquiryMutation } = enquiriesApi
