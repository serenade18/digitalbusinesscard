import type { ProfileBlock, ProfileLink, Product, Service, Testimonial, GalleryItem } from './blocks'
import type { CardTemplate, ThemeConfig } from './templates'

export type VCardStatus = 'draft' | 'published' | 'suspended' | 'archived'
export type VCardVisibility = 'public' | 'unlisted' | 'private'

export interface VCardListItem {
  id: string
  slug: string
  display_name: string
  job_title: string
  company_name: string
  profile_photo: string | null
  status: VCardStatus
  visibility: VCardVisibility
  is_featured: boolean
  is_verified: boolean
  organization: string | null
  created_at: string
  updated_at: string
}

export interface VCard {
  id: string
  organization: string | null
  owner: string
  assigned_user: string | null
  slug: string
  display_name: string
  job_title: string
  company_name: string
  bio: string
  profile_photo: string | null
  cover_photo: string | null
  email: string
  phone: string
  whatsapp: string
  website: string
  address: string
  location: string
  industry: string
  template: string | null
  theme_config: ThemeConfig
  visibility: VCardVisibility
  status: VCardStatus
  is_featured: boolean
  is_verified: boolean
  is_directory_visible: boolean
  public_url: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface VCardCreatePayload {
  organization?: string | null
  display_name: string
  job_title?: string
  company_name?: string
  bio?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  address?: string
  location?: string
  industry?: string
  template?: string | null
  theme_config?: Partial<ThemeConfig>
  visibility?: VCardVisibility
}

export type VCardUpdatePayload = Partial<VCardCreatePayload>

export interface VCardPublic {
  slug: string
  display_name: string
  job_title: string
  company_name: string
  bio: string
  profile_photo: string | null
  cover_photo: string | null
  email: string
  phone: string
  whatsapp: string
  website: string
  address: string
  location: string
  template: CardTemplate | null
  theme_config: ThemeConfig
  links: ProfileLink[]
  services: Service[]
  products: Product[]
  testimonials: Testimonial[]
  gallery_items: GalleryItem[]
  blocks: ProfileBlock[]
}
