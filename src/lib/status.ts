import type { StatusTone } from '@/components/common/StatusBadge'

export function vcardStatusTone(status: string): StatusTone {
  switch (status) {
    case 'published':
      return 'success'
    case 'draft':
      return 'neutral'
    case 'suspended':
      return 'danger'
    case 'archived':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function enquiryStatusTone(status: string): StatusTone {
  switch (status) {
    case 'new':
      return 'info'
    case 'read':
      return 'neutral'
    case 'replied':
      return 'success'
    case 'archived':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function appointmentStatusTone(status: string): StatusTone {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'confirmed':
      return 'info'
    case 'completed':
      return 'success'
    case 'cancelled':
    case 'no_show':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function orderStatusTone(status: string): StatusTone {
  switch (status) {
    case 'delivered':
      return 'success'
    case 'cancelled':
    case 'refunded':
      return 'danger'
    case 'pending_payment':
      return 'warning'
    default:
      return 'info'
  }
}

export function subscriptionStatusTone(status: string): StatusTone {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'success'
    case 'past_due':
      return 'warning'
    case 'cancelled':
    case 'expired':
      return 'danger'
    default:
      return 'neutral'
  }
}
