import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function Field({
  label,
  labelExtra,
  htmlFor,
  error,
  hint,
  children,
  className,
  optional,
}: {
  label?: string
  labelExtra?: ReactNode
  htmlFor?: string
  error?: string
  hint?: ReactNode
  children: ReactNode
  className?: string
  optional?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || labelExtra) && (
        <div className="flex items-center justify-between">
          {label && (
            <Label htmlFor={htmlFor}>
              {label}
              {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
            </Label>
          )}
          {labelExtra}
        </div>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
