import { baseApi } from '@/services/api'
import { hasFile, toFormData } from '@/services/uploads'
import type { GalleryItem, Product, ProfileBlock, ProfileLink, Service, Testimonial } from '@/types/blocks'

function body(payload: Record<string, unknown>) {
  return hasFile(payload) ? toFormData(payload) : payload
}

export const builderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---- Blocks (order + visibility of each page section) -------------
    listBlocks: build.query<ProfileBlock[], string>({
      query: (vcardId) => `/vcards/${vcardId}/blocks/`,
      providesTags: (result) =>
        result ? [...result.map((b) => ({ type: 'Block' as const, id: b.id })), 'Block'] : ['Block'],
    }),
    createBlock: build.mutation<ProfileBlock, { vcardId: string; body: Partial<ProfileBlock> }>({
      query: ({ vcardId, body }) => ({ url: `/vcards/${vcardId}/blocks/`, method: 'POST', body }),
      invalidatesTags: ['Block'],
    }),
    updateBlock: build.mutation<ProfileBlock, { id: string; body: Partial<ProfileBlock> }>({
      query: ({ id, body }) => ({ url: `/blocks/${id}/`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Block', id }],
    }),
    deleteBlock: build.mutation<void, string>({
      query: (id) => ({ url: `/blocks/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Block'],
    }),
    reorderBlocks: build.mutation<void, { vcardId: string; order: string[] }>({
      query: ({ vcardId, order }) => ({
        url: `/vcards/${vcardId}/blocks/reorder/`,
        method: 'POST',
        body: { order },
      }),
      async onQueryStarted({ vcardId, order }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          builderApi.util.updateQueryData('listBlocks', vcardId, (draft) => {
            draft.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
            draft.forEach((b, index) => {
              b.position = index
            })
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: ['Block'],
    }),

    // ---- Links ----------------------------------------------------------
    listLinks: build.query<ProfileLink[], string>({
      query: (vcardId) => `/vcards/${vcardId}/links/`,
      providesTags: (result) =>
        result ? [...result.map((l) => ({ type: 'Link' as const, id: l.id })), 'Link'] : ['Link'],
    }),
    createLink: build.mutation<ProfileLink, { vcardId: string; body: Partial<ProfileLink> }>({
      query: ({ vcardId, body: b }) => ({ url: `/vcards/${vcardId}/links/`, method: 'POST', body: b }),
      invalidatesTags: ['Link'],
    }),
    updateLink: build.mutation<ProfileLink, { id: string; body: Partial<ProfileLink> }>({
      query: ({ id, body: b }) => ({ url: `/links/${id}/`, method: 'PATCH', body: b }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Link', id }],
    }),
    deleteLink: build.mutation<void, string>({
      query: (id) => ({ url: `/links/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Link'],
    }),

    // ---- Services ---------------------------------------------------------
    listServices: build.query<Service[], string>({
      query: (vcardId) => `/vcards/${vcardId}/services/`,
      providesTags: (result) =>
        result ? [...result.map((s) => ({ type: 'Service' as const, id: s.id })), 'Service'] : ['Service'],
    }),
    createService: build.mutation<Service, { vcardId: string; body: Partial<Service> }>({
      query: ({ vcardId, body: b }) => ({ url: `/vcards/${vcardId}/services/`, method: 'POST', body: body(b) }),
      invalidatesTags: ['Service'],
    }),
    updateService: build.mutation<Service, { id: string; body: Partial<Service> }>({
      query: ({ id, body: b }) => ({ url: `/services/${id}/`, method: 'PATCH', body: body(b) }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Service', id }],
    }),
    deleteService: build.mutation<void, string>({
      query: (id) => ({ url: `/services/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Service'],
    }),

    // ---- Products ---------------------------------------------------------
    listProducts: build.query<Product[], string>({
      query: (vcardId) => `/vcards/${vcardId}/products/`,
      providesTags: (result) =>
        result ? [...result.map((p) => ({ type: 'Product' as const, id: p.id })), 'Product'] : ['Product'],
    }),
    createProduct: build.mutation<Product, { vcardId: string; body: Partial<Product> }>({
      query: ({ vcardId, body: b }) => ({ url: `/vcards/${vcardId}/products/`, method: 'POST', body: body(b) }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: build.mutation<Product, { id: string; body: Partial<Product> }>({
      query: ({ id, body: b }) => ({ url: `/products/${id}/`, method: 'PATCH', body: body(b) }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Product', id }],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),

    // ---- Testimonials ----------------------------------------------------
    listTestimonials: build.query<Testimonial[], string>({
      query: (vcardId) => `/vcards/${vcardId}/testimonials/`,
      providesTags: (result) =>
        result
          ? [...result.map((t) => ({ type: 'Testimonial' as const, id: t.id })), 'Testimonial']
          : ['Testimonial'],
    }),
    createTestimonial: build.mutation<Testimonial, { vcardId: string; body: Partial<Testimonial> }>({
      query: ({ vcardId, body: b }) => ({ url: `/vcards/${vcardId}/testimonials/`, method: 'POST', body: body(b) }),
      invalidatesTags: ['Testimonial'],
    }),
    updateTestimonial: build.mutation<Testimonial, { id: string; body: Partial<Testimonial> }>({
      query: ({ id, body: b }) => ({ url: `/testimonials/${id}/`, method: 'PATCH', body: body(b) }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Testimonial', id }],
    }),
    deleteTestimonial: build.mutation<void, string>({
      query: (id) => ({ url: `/testimonials/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Testimonial'],
    }),

    // ---- Gallery ----------------------------------------------------------
    listGalleryItems: build.query<GalleryItem[], string>({
      query: (vcardId) => `/vcards/${vcardId}/gallery-items/`,
      providesTags: (result) =>
        result
          ? [...result.map((g) => ({ type: 'GalleryItem' as const, id: g.id })), 'GalleryItem']
          : ['GalleryItem'],
    }),
    createGalleryItem: build.mutation<GalleryItem, { vcardId: string; body: Partial<GalleryItem> }>({
      query: ({ vcardId, body: b }) => ({
        url: `/vcards/${vcardId}/gallery-items/`,
        method: 'POST',
        body: body(b),
      }),
      invalidatesTags: ['GalleryItem'],
    }),
    updateGalleryItem: build.mutation<GalleryItem, { id: string; body: Partial<GalleryItem> }>({
      query: ({ id, body: b }) => ({ url: `/gallery-items/${id}/`, method: 'PATCH', body: body(b) }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'GalleryItem', id }],
    }),
    deleteGalleryItem: build.mutation<void, string>({
      query: (id) => ({ url: `/gallery-items/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['GalleryItem'],
    }),
  }),
})

export const {
  useListBlocksQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useReorderBlocksMutation,
  useListLinksQuery,
  useCreateLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
  useListServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useListProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useListTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useListGalleryItemsQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = builderApi
