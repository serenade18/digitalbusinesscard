import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { useListAppointmentsQuery, useUpdateAppointmentStatusMutation } from '@/features/appointments/appointmentsApi'
import { appointmentStatusTone } from '@/lib/status'
import { formatDate } from '@/lib/format'
import type { AppointmentStatus } from '@/types/appointments'

const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'no_show', 'cancelled'],
  completed: [],
  cancelled: [],
  no_show: [],
}

export function BookingsPanel({ vcardId }: { vcardId: string }) {
  const { data, isLoading } = useListAppointmentsQuery()
  const [updateStatus] = useUpdateAppointmentStatusMutation()

  const bookings = (data ?? []).filter((a) => a.vcard === vcardId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return <EmptyState title="No bookings yet" />
  }

  return (
    <div className="flex flex-col gap-2">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">{booking.customer_name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(booking.date)} · {booking.start_time.slice(0, 5)}–{booking.end_time.slice(0, 5)}
            </p>
            <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} tone={appointmentStatusTone(booking.status)} />
            {transitions[booking.status].map((next) => (
              <Button
                key={next}
                variant="outline"
                size="sm"
                onClick={() => void updateStatus({ id: booking.id, body: { status: next } })}
              >
                {next.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
