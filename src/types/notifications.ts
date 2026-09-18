export type NotificationType =
  | 'welcome'
  | 'email_verification'
  | 'password_reset'
  | 'new_enquiry'
  | 'new_appointment'
  | 'appointment_reminder'
  | 'payment_successful'
  | 'payment_failed'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  link_url: string
  metadata: Record<string, unknown>
  is_read: boolean
  read_at: string | null
  created_at: string
}
