export interface AppointmentService {
  id: string
  vcard: string
  name: string
  description: string
  duration_minutes: number
  price: string | null
  currency: string
  is_active: boolean
}

export const WEEKDAYS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
] as const

export interface AvailabilityRule {
  id: string
  vcard: string
  weekday: number
  start_time: string
  end_time: string
  timezone: string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface Appointment {
  id: string
  vcard: string
  service: string
  customer_name: string
  customer_email: string
  customer_phone: string
  date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes: string
  created_at: string
}

export interface AppointmentStatusUpdatePayload {
  status: AppointmentStatus
  notes?: string
}

export interface AvailabilitySlot {
  start_time: string
  end_time: string
}
