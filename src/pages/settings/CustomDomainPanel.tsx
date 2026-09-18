import { Globe } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

export function CustomDomainPanel() {
  return (
    <section className="rounded-2xl border border-border bg-background p-6">
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Custom domain</h2>
      <EmptyState
        icon={Globe}
        title="Coming soon"
        description="Point your own domain at your card instead of the default link. This is planned for a later release."
      />
    </section>
  )
}
