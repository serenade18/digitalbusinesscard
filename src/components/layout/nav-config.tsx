import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  CalendarClock,
  CreditCard,
  Globe,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  Package,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const primaryNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { label: 'Cards', to: '/app/cards', icon: WalletCards },
  { label: 'Templates', to: '/app/templates', icon: LayoutTemplate },
  { label: 'Analytics', to: '/app/analytics', icon: BarChart3 },
  { label: 'Enquiries', to: '/app/enquiries', icon: Inbox },
  { label: 'Appointments', to: '/app/appointments', icon: CalendarClock },
  { label: 'Directory', to: '/app/directory', icon: Globe },
  { label: 'Team', to: '/app/team', icon: Users },
  { label: 'Orders', to: '/app/orders', icon: Package },
  { label: 'Billing', to: '/app/billing', icon: CreditCard },
]

export const secondaryNavItems: NavItem[] = [{ label: 'Settings', to: '/app/settings', icon: Settings }]
