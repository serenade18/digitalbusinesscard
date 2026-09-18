export interface User {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  full_name: string
  avatar: string | null
  email_verified: boolean
  is_active: boolean
  date_joined: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginResponse extends AuthTokens {
  user: User
}

export interface RegisterPayload {
  email: string
  phone?: string
  first_name: string
  last_name: string
  password: string
}

export interface RegisterResponse extends AuthTokens {
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  uid: string
  token: string
  new_password: string
}

export interface VerifyEmailPayload {
  uid: string
  token: string
}
