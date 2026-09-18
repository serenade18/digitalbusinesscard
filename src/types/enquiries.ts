export type EnquiryStatus = 'new' | 'read' | 'replied' | 'archived'

export interface Enquiry {
  id: string
  vcard: string
  name: string
  email: string
  phone: string
  message: string
  status: EnquiryStatus
  created_at: string
}

export interface EnquiryStatusUpdatePayload {
  status: EnquiryStatus
}
