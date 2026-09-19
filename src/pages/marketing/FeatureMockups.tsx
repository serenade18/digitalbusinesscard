import { Check, Clock, GripVertical, Link2, SmartphoneNfc, TrendingUp } from 'lucide-react'
import { cn } from 'cn'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

const builderBlocks = [
  { label: 'Profile', on: true },
  { label: 'Bio', on: true },
  { label: 'Socials', on: true },
  { label: 'Gallery', on: false },
]

export function BuilderMockup() {
  return (
    <div aria-hidden className="flex size-full items-center gap-4 p-5 sm:gap-6 sm:p-8">
      <div className="flex w-1/2 flex-col gap-2">
        {builderBlocks.map((block) => (
          <div
            key={block.label}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2"
          >
            <GripVertical className="size-3.5 shrink-0 text-muted-foreground/50" />
            <span className="flex-1 truncate text-xs font-medium">{block.label}</span>
            <Switch checked={block.on} size="sm" />
          </div>
        ))}
      </div>
      <div className="mx-auto flex aspect-9/16 h-full max-h-56 w-auto flex-col gap-2 rounded-[1.25rem] border-4 border-background bg-card p-3 shadow-lg ring-1 ring-border">
        <div className="mx-auto size-8 rounded-full bg-brand/15" />
        <div className="mx-auto h-1.5 w-16 rounded-full bg-foreground/10" />
        <div className="mx-auto h-1.5 w-10 rounded-full bg-foreground/10" />
        <div className="mt-2 h-8 rounded-lg bg-muted" />
        <div className="h-8 rounded-lg bg-muted" />
        <div className="h-8 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

const qrPattern = [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1]

export function ShareMockup() {
  return (
    <div aria-hidden className="flex size-full flex-col items-center justify-center gap-4 p-6">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
        <Link2 className="size-4 text-brand" />
        <span className="text-sm font-medium">dbc.to/kate.wilson</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-3">
          <div className="grid grid-cols-4 gap-px">
            {qrPattern.map((filled, i) => (
              <span key={i} className={cn('size-1.5 rounded-[1px]', filled ? 'bg-foreground' : 'bg-transparent')} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">QR code</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-3">
          <SmartphoneNfc className="size-6 text-brand" />
          <span className="text-[10px] text-muted-foreground">NFC tap</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-3">
          <Check className="size-6 text-emerald-600" />
          <span className="text-[10px] text-muted-foreground">Save contact</span>
        </div>
      </div>
    </div>
  )
}

const barHeights = [30, 55, 40, 70, 50, 85, 60]

export function AnalyticsMockup() {
  return (
    <div aria-hidden className="flex size-full flex-col justify-center gap-4 p-6">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">2,481</span>
        <span className="text-xs text-muted-foreground">views this month</span>
        <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="size-3.5" /> 18%
        </span>
      </div>
      <div className="flex h-20 items-end gap-2">
        {barHeights.map((height, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-brand/70" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  )
}

const enquiries = [
  { name: 'Priya Anand', message: 'Are you available for a shoot next week?', status: 'New' as const },
  { name: 'Jordan Blake', message: 'Loved the portfolio — quick question on pricing.', status: 'New' as const },
  { name: 'Marcus Reed', message: 'Thanks for getting back to me!', status: 'Replied' as const },
]

export function InboxMockup() {
  return (
    <div aria-hidden className="flex size-full flex-col justify-center gap-2 p-5 sm:p-6">
      {enquiries.map((item) => (
        <div key={item.name} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
          <Avatar size="sm">
            <AvatarFallback>{initials(item.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{item.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{item.message}</p>
          </div>
          <Badge variant={item.status === 'New' ? 'default' : 'outline'} className="shrink-0">
            {item.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const availability = [false, true, true, false, true, true, false]
const slots = ['9:00 AM', '11:30 AM', '2:00 PM']

export function BookingsMockup() {
  return (
    <div aria-hidden className="flex size-full items-center justify-center gap-6 p-6">
      <div className="grid grid-cols-7 gap-1.5">
        {weekdayLabels.map((day, i) => (
          <span key={i} className="flex size-6 items-center justify-center text-[10px] font-medium text-muted-foreground">
            {day}
          </span>
        ))}
        {availability.map((available, i) => (
          <span
            key={i}
            className={cn(
              'flex size-6 items-center justify-center rounded-full text-[10px] font-medium',
              i === 2
                ? 'bg-brand text-brand-foreground'
                : available
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted-foreground/30',
            )}
          >
            {i + 10}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        {slots.map((slot) => (
          <span
            key={slot}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium"
          >
            <Clock className="size-3 text-muted-foreground" /> {slot}
          </span>
        ))}
      </div>
    </div>
  )
}

const team = [
  { name: 'Sofia Marin', role: 'Owner' },
  { name: 'Jordan Blake', role: 'Admin' },
  { name: 'Elena Cho', role: 'Member' },
]

export function TeamMockup() {
  return (
    <div aria-hidden className="flex size-full flex-col justify-center gap-2 p-5 sm:p-6">
      {team.map((member) => (
        <div key={member.name} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
          <Avatar size="sm">
            <AvatarFallback>{initials(member.name)}</AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate text-xs font-medium">{member.name}</span>
          <Badge variant="outline">{member.role}</Badge>
        </div>
      ))}
    </div>
  )
}
