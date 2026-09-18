import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useUnreadNotificationCountQuery,
} from '@/features/notifications/notificationsApi'
import type { Notification } from '@/types/notifications'
import { cn } from '@/lib/utils'

export function NotificationsMenu() {
  const { data: unread } = useUnreadNotificationCountQuery(undefined, { pollingInterval: 60_000 })
  const { data } = useListNotificationsQuery()
  const [markRead] = useMarkNotificationReadMutation()
  const [markAllRead] = useMarkAllNotificationsReadMutation()

  const notifications = data?.results ?? []
  const count = unread?.count ?? 0

  function handleClick(notification: Notification) {
    if (!notification.is_read) void markRead(notification.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-medium text-brand-foreground">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {count > 0 && (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => void markAllRead()}
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
        )}
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleClick(notification)}
              className={cn('flex flex-col items-start gap-0.5 whitespace-normal', !notification.is_read && 'bg-muted/60')}
            >
              <span className="text-sm font-medium">{notification.title}</span>
              {notification.body && <span className="text-xs text-muted-foreground">{notification.body}</span>}
              <span className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
