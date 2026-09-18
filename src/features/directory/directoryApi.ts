import { baseApi } from '@/services/api'
import type { DirectoryVisibilityPayload } from '@/types/directory'
import type { VCard } from '@/types/cards'

export const directoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateDirectoryVisibility: build.mutation<
      Pick<VCard, 'is_directory_visible' | 'industry'>,
      { vcardId: string; body: DirectoryVisibilityPayload }
    >({
      query: ({ vcardId, body }) => ({ url: `/directory/vcards/${vcardId}/`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { vcardId }) => [{ type: 'VCard', id: vcardId }],
    }),
  }),
})

export const { useUpdateDirectoryVisibilityMutation } = directoryApi
