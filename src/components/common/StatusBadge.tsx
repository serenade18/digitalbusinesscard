import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { titleCase } from '@/lib/format'

const toneClasses = {
  neutral: 'bg-muted text-muted-foreground',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-brand/10 text-brand',
} as const

export type StatusTone = keyof typeof toneClasses

export function StatusBadge({ status, tone }: { status: string; tone: StatusTone }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', toneClasses[tone])}>
      {titleCase(status)}
    </Badge>
  )
}
