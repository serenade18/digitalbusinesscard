import { baseApi } from '@/services/api'
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  User,
  VerifyEmailPayload,
} from '@/types/auth'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({ url: '/auth/register/', method: 'POST', body }),
    }),
    login: build.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({ url: '/auth/login/', method: 'POST', body }),
    }),
    logout: build.mutation<void, { refresh: string }>({
      query: (body) => ({ url: '/auth/logout/', method: 'POST', body }),
    }),
    me: build.query<User, void>({
      query: () => '/auth/me/',
      providesTags: ['Me'],
    }),
    updateMe: build.mutation<User, Partial<User> | FormData>({
      query: (body) => ({ url: '/auth/me/', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    changePassword: build.mutation<{ detail: string }, ChangePasswordPayload>({
      query: (body) => ({ url: '/auth/change-password/', method: 'POST', body }),
    }),
    forgotPassword: build.mutation<{ detail: string }, ForgotPasswordPayload>({
      query: (body) => ({ url: '/auth/forgot-password/', method: 'POST', body }),
    }),
    resetPassword: build.mutation<{ detail: string }, ResetPasswordPayload>({
      query: (body) => ({ url: '/auth/reset-password/', method: 'POST', body }),
    }),
    verifyEmail: build.mutation<{ detail: string }, VerifyEmailPayload>({
      query: (body) => ({ url: '/auth/verify-email/', method: 'POST', body }),
    }),
    resendVerification: build.mutation<{ detail: string }, void>({
      query: () => ({ url: '/auth/resend-verification/', method: 'POST' }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useLazyMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi
