import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
        <span className="text-sm font-bold">D</span>
      </span>
      <span className="text-base">DBC</span>
    </Link>
  )
}
