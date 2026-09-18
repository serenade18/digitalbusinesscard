export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  buttonStyle: 'rounded' | 'pill' | 'square'
  cardStyle: 'glass' | 'solid' | 'outline'
  fontFamily: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primaryColor: '#111827',
  secondaryColor: '#6B7280',
  backgroundColor: '#FFFFFF',
  textColor: '#111827',
  buttonStyle: 'rounded',
  cardStyle: 'glass',
  fontFamily: 'Inter',
  borderRadius: 'lg',
}

export interface CardTemplate {
  id: string
  name: string
  slug: string
  preview_image: string | null
  category: string
  configuration: Record<string, unknown>
  is_premium: boolean
}
