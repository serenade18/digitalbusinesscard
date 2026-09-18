export interface Plan {
  id: string
  name: string
  slug: string
  description: string
  monthly_price: string
  annual_price: string
  currency: string
  max_vcards: number
  max_storage_mb: number
  max_team_members: number
  max_gallery_items: number
  max_products: number
  max_services: number
  analytics_enabled: boolean
  appointments_enabled: boolean
  custom_domain_enabled: boolean
  directory_enabled: boolean
  remove_branding: boolean
  priority_support: boolean
}

export type SubscriptionProvider = 'stripe' | 'mpesa' | 'sasapay'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'paused'

export interface Subscription {
  id: string
  organization: string | null
  owner: string
  plan: Plan
  provider: SubscriptionProvider
  status: SubscriptionStatus
  trial_start: string | null
  trial_end: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface CheckoutPayload {
  plan_id: string
  provider: SubscriptionProvider
  organization_id?: string | null
}

export interface CheckoutResult {
  redirect_url: string | null
  provider_reference: string
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface Payment {
  id: string
  provider: SubscriptionProvider
  provider_reference: string
  amount: string
  currency: string
  status: PaymentStatus
  payment_method: string
  paid_at: string | null
  created_at: string
}
