export type ProfileBlockType =
  | 'social'
  | 'link'
  | 'service'
  | 'product'
  | 'testimonial'
  | 'gallery'
  | 'video'
  | 'contact'
  | 'location'
  | 'appointment'
  | 'custom'

export interface ProfileBlock {
  id: string
  vcard: string
  type: ProfileBlockType
  title: string
  content: Record<string, unknown>
  position: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

export interface ProfileLink {
  id: string
  vcard: string
  title: string
  url: string
  icon: string
  position: number
  is_visible: boolean
}

export interface Service {
  id: string
  vcard: string
  name: string
  description: string
  price: string | null
  currency: string
  image: string | null
  booking_enabled: boolean
  position: number
  is_visible: boolean
}

export interface Product {
  id: string
  vcard: string
  name: string
  description: string
  price: string | null
  currency: string
  image: string | null
  external_url: string
  position: number
  is_visible: boolean
}

export interface Testimonial {
  id: string
  vcard: string
  customer_name: string
  customer_title: string
  customer_photo: string | null
  content: string
  rating: number | null
  position: number
  is_visible: boolean
}

export interface GalleryItem {
  id: string
  vcard: string
  image: string
  title: string
  description: string
  position: number
  is_visible: boolean
}
