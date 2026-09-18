import type { LucideIcon } from 'lucide-react'

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </div>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
    </div>
  )
}
