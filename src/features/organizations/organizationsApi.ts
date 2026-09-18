import { baseApi } from '@/services/api'
import type { Paginated } from '@/types/common'
import type {
  MemberInvitePayload,
  MemberUpdatePayload,
  Organization,
  OrganizationMember,
} from '@/types/organizations'

export const organizationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listOrganizations: build.query<Paginated<Organization>, void>({
      query: () => '/organizations/',
      providesTags: (result) =>
        result
          ? [...result.results.map((org) => ({ type: 'Organization' as const, id: org.id })), 'Organization']
          : ['Organization'],
    }),
    getOrganization: build.query<Organization, string>({
      query: (id) => `/organizations/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Organization', id }],
    }),
    createOrganization: build.mutation<Organization, Partial<Organization>>({
      query: (body) => ({ url: '/organizations/', method: 'POST', body }),
      invalidatesTags: ['Organization'],
    }),
    updateOrganization: build.mutation<Organization, { id: string; body: Partial<Organization> | FormData }>({
      query: ({ id, body }) => ({ url: `/organizations/${id}/`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Organization', id }],
    }),
    listMembers: build.query<OrganizationMember[], string>({
      query: (orgId) => `/organizations/${orgId}/members/`,
      providesTags: (result) =>
        result
          ? [...result.map((m) => ({ type: 'Member' as const, id: m.id })), 'Member']
          : ['Member'],
    }),
    inviteMember: build.mutation<OrganizationMember, { orgId: string; body: MemberInvitePayload }>({
      query: ({ orgId, body }) => ({ url: `/organizations/${orgId}/members/invite/`, method: 'POST', body }),
      invalidatesTags: ['Member'],
    }),
    updateMember: build.mutation<OrganizationMember, { orgId: string; memberId: string; body: MemberUpdatePayload }>({
      query: ({ orgId, memberId, body }) => ({
        url: `/organizations/${orgId}/members/${memberId}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Member'],
    }),
    removeMember: build.mutation<void, { orgId: string; memberId: string }>({
      query: ({ orgId, memberId }) => ({ url: `/organizations/${orgId}/members/${memberId}/`, method: 'DELETE' }),
      invalidatesTags: ['Member'],
    }),
  }),
})

export const {
  useListOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useListMembersQuery,
  useInviteMemberMutation,
  useUpdateMemberMutation,
  useRemoveMemberMutation,
} = organizationsApi
