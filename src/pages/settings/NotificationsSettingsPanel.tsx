import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDateTime } from '@/lib/format'
import {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '@/features/notifications/notificationsApi'

export function NotificationsSettingsPanel() {
  const { data, isLoading } = useListNotificationsQuery()
  const [markAllRead, { isLoading: isMarking }] = useMarkAllNotificationsReadMutation()

  const notifications = data?.results ?? []

  return (
    <section className="rounded-2xl border border-border bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Notifications</h2>
        <Button variant="outline" size="sm" disabled={isMarking} onClick={() => void markAllRead()}>
          Mark all read
        </Button>
      </div>

      {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
      {!isLoading && notifications.length === 0 && <EmptyState title="No notifications yet" />}

      <div className="flex flex-col gap-2">
        {notifications.slice(0, 20).map((n) => (
          <div key={n.id} className="rounded-lg border border-border p-3">
            <p className="text-sm font-medium">{n.title}</p>
            {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
            <p className="mt-1 text-[11px] text-muted-foreground">{formatDateTime(n.created_at)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
