import type { User } from './auth'

export type OrganizationRole = 'owner' | 'admin' | 'member'
export type OrganizationMemberStatus = 'invited' | 'active' | 'suspended'

export interface Organization {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string
  website: string
  email: string
  phone: string
  country: string
  timezone: string
  my_role: OrganizationRole | null
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization: string
  user: User
  role: OrganizationRole
  status: OrganizationMemberStatus
  invited_at: string
  joined_at: string | null
}

export interface MemberInvitePayload {
  email: string
  role: Exclude<OrganizationRole, 'owner'>
}

export interface MemberUpdatePayload {
  role?: Exclude<OrganizationRole, 'owner'>
  status?: OrganizationMemberStatus
}
