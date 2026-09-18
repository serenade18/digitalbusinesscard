import { baseApi } from '@/services/api'
import type { Paginated } from '@/types/common'
import type { Order, OrderCreatePayload, PhysicalCardProduct } from '@/types/orders'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPhysicalCardProducts: build.query<PhysicalCardProduct[], void>({
      query: () => '/orders/products/',
    }),
    listOrders: build.query<Paginated<Order>, void>({
      query: () => '/orders/',
      providesTags: (result) =>
        result
          ? [...result.results.map((o) => ({ type: 'Order' as const, id: o.id })), 'Order']
          : ['Order'],
    }),
    getOrder: build.query<Order, string>({
      query: (id) => `/orders/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    createOrder: build.mutation<{ order: Order; redirect_url: string | null }, OrderCreatePayload>({
      query: (body) => ({ url: '/orders/', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const { useListPhysicalCardProductsQuery, useListOrdersQuery, useGetOrderQuery, useCreateOrderMutation } =
  ordersApi
