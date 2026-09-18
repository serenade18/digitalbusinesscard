import { baseApi } from '@/services/api'
import type { Paginated } from '@/types/common'
import type { CardTemplate } from '@/types/templates'

export const templatesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTemplates: build.query<Paginated<CardTemplate>, { category?: string; is_premium?: boolean } | void>({
      query: (params) => ({ url: '/templates/', params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [...result.results.map((t) => ({ type: 'Template' as const, id: t.id })), 'Template']
          : ['Template'],
    }),
    getTemplate: build.query<CardTemplate, string>({
      query: (id) => `/templates/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Template', id }],
    }),
  }),
})

export const { useListTemplatesQuery, useGetTemplateQuery } = templatesApi
