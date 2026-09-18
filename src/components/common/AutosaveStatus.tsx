import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

export function AutosaveStatus({ state, className }: { state: AutosaveState; className?: string }) {
  if (state === 'idle') return null

  return (
    <span className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      {state === 'saving' && (
        <>
          <Loader2 className="size-3 animate-spin" /> Saving…
        </>
      )}
      {state === 'saved' && (
        <>
          <Check className="size-3 text-brand" /> Saved
        </>
      )}
      {state === 'error' && (
        <span className="flex items-center gap-1.5 text-destructive">
          <AlertCircle className="size-3" /> Couldn't save
        </span>
      )}
    </span>
  )
}
