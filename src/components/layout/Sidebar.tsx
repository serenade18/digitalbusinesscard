import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/Logo'
import { primaryNavItems, secondaryNavItems } from '@/components/layout/nav-config'

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      <ul className="flex flex-col gap-0.5">
        {primaryNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/app'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-foreground text-background hover:bg-foreground hover:text-background',
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <ul className="mt-auto flex flex-col gap-0.5">
        {secondaryNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-foreground text-background hover:bg-foreground hover:text-background',
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Logo to="/app" />
      </div>
      <NavList />
    </aside>
  )
}

export function MobileSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Logo to="/app" />
      </div>
      <NavList onNavigate={onNavigate} />
    </div>
  )
}
