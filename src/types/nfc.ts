export type NfcMaterial = 'pet_plastic' | 'wood' | 'metal'
export type NfcCardStatus = 'inventory' | 'reserved' | 'assigned' | 'active' | 'blocked' | 'retired'

export interface NfcCard {
  id: string
  uid: string
  serial_number: string
  material: NfcMaterial
  vcard: string | null
  order: string | null
  status: NfcCardStatus
  activated_at: string | null
  write_payload: string
  created_at: string
}

export interface NfcAssignPayload {
  vcard_id: string
}

export interface NfcRegisterPayload {
  uid: string
  serial_number: string
  material: NfcMaterial
}
