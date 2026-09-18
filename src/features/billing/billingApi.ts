import { baseApi } from '@/services/api'
import type { CheckoutPayload, CheckoutResult, Payment, Plan, Subscription } from '@/types/billing'

export const billingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPlans: build.query<Plan[], void>({
      query: () => '/billing/plans/',
      providesTags: ['Plan'],
    }),
    getSubscription: build.query<Subscription, { organizationId?: string | null } | void>({
      query: (arg) => ({
        url: '/billing/subscription/',
        params: arg?.organizationId ? { organization: arg.organizationId } : undefined,
      }),
      providesTags: ['Subscription'],
    }),
    checkout: build.mutation<CheckoutResult, CheckoutPayload>({
      query: (body) => ({ url: '/billing/checkout/', method: 'POST', body }),
      invalidatesTags: ['Subscription'],
    }),
    cancelSubscription: build.mutation<Subscription, { organization_id?: string | null } | void>({
      query: (body) => ({ url: '/billing/cancel/', method: 'POST', body: body ?? undefined }),
      invalidatesTags: ['Subscription'],
    }),
    reactivateSubscription: build.mutation<Subscription, { organization_id?: string | null } | void>({
      query: (body) => ({ url: '/billing/reactivate/', method: 'POST', body: body ?? undefined }),
      invalidatesTags: ['Subscription'],
    }),
    listInvoices: build.query<Payment[], { organizationId?: string | null } | void>({
      query: (arg) => ({
        url: '/billing/invoices/',
        params: arg?.organizationId ? { organization: arg.organizationId } : undefined,
      }),
      providesTags: ['Invoice'],
    }),
  }),
})

export const {
  useListPlansQuery,
  useGetSubscriptionQuery,
  useCheckoutMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useListInvoicesQuery,
} = billingApi
