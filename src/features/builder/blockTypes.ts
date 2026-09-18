import {
  Briefcase,
  Calendar,
  Image,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquareQuote,
  Package,
  Share2,
  Sparkles,
  Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ProfileBlockType } from '@/types/blocks'

export type BlockEditorKind = 'links' | 'services' | 'products' | 'testimonials' | 'gallery' | 'content' | 'none'

export interface BlockTypeMeta {
  type: ProfileBlockType
  label: string
  description: string
  icon: LucideIcon
  editor: BlockEditorKind
}

export const blockTypeMeta: Record<ProfileBlockType, BlockTypeMeta> = {
  social: {
    type: 'social',
    label: 'Social links',
    description: 'Instagram, LinkedIn, X, and other social profiles.',
    icon: Share2,
    editor: 'links',
  },
  link: {
    type: 'link',
    label: 'Custom links',
    description: 'Any link you want to feature — portfolio, booking page, etc.',
    icon: LinkIcon,
    editor: 'links',
  },
  service: {
    type: 'service',
    label: 'Services',
    description: 'What you offer, with optional pricing and booking.',
    icon: Briefcase,
    editor: 'services',
  },
  product: {
    type: 'product',
    label: 'Products',
    description: 'Items for sale, with price and an external buy link.',
    icon: Package,
    editor: 'products',
  },
  testimonial: {
    type: 'testimonial',
    label: 'Testimonials',
    description: 'Quotes and ratings from customers.',
    icon: MessageSquareQuote,
    editor: 'testimonials',
  },
  gallery: {
    type: 'gallery',
    label: 'Gallery',
    description: 'A grid of photos.',
    icon: Image,
    editor: 'gallery',
  },
  video: {
    type: 'video',
    label: 'Video',
    description: 'Embed a video by URL.',
    icon: Video,
    editor: 'content',
  },
  contact: {
    type: 'contact',
    label: 'Contact',
    description: 'An extra note alongside your contact details.',
    icon: Mail,
    editor: 'content',
  },
  location: {
    type: 'location',
    label: 'Location',
    description: 'A map link to your address.',
    icon: MapPin,
    editor: 'content',
  },
  appointment: {
    type: 'appointment',
    label: 'Book appointment',
    description: 'Booking button — configure services and availability under Appointments.',
    icon: Calendar,
    editor: 'none',
  },
  custom: {
    type: 'custom',
    label: 'Custom block',
    description: 'Freeform text block.',
    icon: Sparkles,
    editor: 'content',
  },
}

export const addableBlockTypes: BlockTypeMeta[] = Object.values(blockTypeMeta)
