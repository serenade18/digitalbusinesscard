import { baseApi } from '@/services/api'
import { unwrapResults } from '@/lib/pagination'
import type {
  Appointment,
  AppointmentService,
  AppointmentStatusUpdatePayload,
  AvailabilityRule,
} from '@/types/appointments'

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Bookings — the backend returns every appointment accessible to the
    // user (no server-side ?vcard= filter on this viewset), so callers
    // filter by vcard client-side.
    listAppointments: build.query<Appointment[], void>({
      query: () => '/appointments/',
      transformResponse: unwrapResults<Appointment>,
      providesTags: (result) =>
        result
          ? [...result.map((a) => ({ type: 'Appointment' as const, id: a.id })), 'Appointment']
          : ['Appointment'],
    }),
    updateAppointmentStatus: build.mutation<Appointment, { id: string; body: AppointmentStatusUpdatePayload }>({
      query: ({ id, body }) => ({ url: `/appointments/${id}/`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Appointment', id }],
    }),
    deleteAppointment: build.mutation<void, string>({
      query: (id) => ({ url: `/appointments/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Appointment'],
    }),

    // Services (bookable offerings for a card)
    listAppointmentServices: build.query<AppointmentService[], string>({
      query: (vcardId) => `/appointments/vcards/${vcardId}/services/`,
      transformResponse: unwrapResults<AppointmentService>,
      providesTags: (result) =>
        result
          ? [...result.map((s) => ({ type: 'AppointmentService' as const, id: s.id })), 'AppointmentService']
          : ['AppointmentService'],
    }),
    createAppointmentService: build.mutation<AppointmentService, { vcardId: string; body: Partial<AppointmentService> }>({
      query: ({ vcardId, body }) => ({ url: `/appointments/vcards/${vcardId}/services/`, method: 'POST', body }),
      invalidatesTags: ['AppointmentService'],
    }),
    updateAppointmentService: build.mutation<AppointmentService, { id: string; body: Partial<AppointmentService> }>({
      query: ({ id, body }) => ({ url: `/appointments/services/${id}/`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'AppointmentService', id }],
    }),
    deleteAppointmentService: build.mutation<void, string>({
      query: (id) => ({ url: `/appointments/services/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['AppointmentService'],
    }),

    // Availability rules
    listAvailabilityRules: build.query<AvailabilityRule[], string>({
      query: (vcardId) => `/appointments/vcards/${vcardId}/availability/`,
      transformResponse: unwrapResults<AvailabilityRule>,
      providesTags: (result) =>
        result
          ? [...result.map((r) => ({ type: 'AvailabilityRule' as const, id: r.id })), 'AvailabilityRule']
          : ['AvailabilityRule'],
    }),
    createAvailabilityRule: build.mutation<AvailabilityRule, { vcardId: string; body: Partial<AvailabilityRule> }>({
      query: ({ vcardId, body }) => ({ url: `/appointments/vcards/${vcardId}/availability/`, method: 'POST', body }),
      invalidatesTags: ['AvailabilityRule'],
    }),
    deleteAvailabilityRule: build.mutation<void, string>({
      query: (id) => ({ url: `/appointments/availability/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['AvailabilityRule'],
    }),
  }),
})

export const {
  useListAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
  useListAppointmentServicesQuery,
  useCreateAppointmentServiceMutation,
  useUpdateAppointmentServiceMutation,
  useDeleteAppointmentServiceMutation,
  useListAvailabilityRulesQuery,
  useCreateAvailabilityRuleMutation,
  useDeleteAvailabilityRuleMutation,
} = appointmentsApi
