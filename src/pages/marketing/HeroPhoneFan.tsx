import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, Link2, Mail, MapPin, Phone, Share2 } from 'lucide-react'
import { cn } from 'cn'

type Action = {
  icon: LucideIcon
  label: string
  value: string
  chip: string
}

type ShowcaseCard = {
  name: string
  title: string
  initials: string
  theme: string
  rotate: number
  translateX: number
  translateY: number
  z: number
  emphasis?: boolean
  hideBelow?: 'sm' | 'md'
  actions: Action[]
}

const cards: ShowcaseCard[] = [
  {
    name: 'Priya Anand',
    title: 'Real Estate Broker',
    initials: 'PA',
    theme: 'bg-gradient-to-b from-amber-800 via-amber-950 to-stone-950',
    rotate: -12,
    translateX: -230,
    translateY: 36,
    z: 0,
    hideBelow: 'md',
    actions: [
      { icon: Phone, label: 'Call me', value: '+1 212 456 7890', chip: 'bg-emerald-500' },
      { icon: MapPin, label: 'Visit my office', value: '2093 Philadelphia Pike', chip: 'bg-rose-500' },
    ],
  },
  {
    name: 'Jordan Blake',
    title: 'Wedding Photographer',
    initials: 'JB',
    theme: 'bg-gradient-to-b from-slate-800 via-slate-900 to-black',
    rotate: -6,
    translateX: -95,
    translateY: 16,
    z: 10,
    hideBelow: 'sm',
    actions: [
      { icon: Phone, label: 'Call me', value: '+1 212 456 7890', chip: 'bg-emerald-500' },
      { icon: Share2, label: 'Follow me', value: '@jordan.blake', chip: 'bg-blue-500' },
    ],
  },
  {
    name: 'Sofia Marin',
    title: 'Wellness Coach · Founder, Kalm',
    initials: 'SM',
    theme: 'bg-card border border-border',
    rotate: 0,
    translateX: 0,
    translateY: 0,
    z: 20,
    emphasis: true,
    actions: [
      { icon: Phone, label: 'Call me', value: '+1 212 456 7890', chip: 'bg-emerald-500' },
      { icon: Link2, label: 'Follow me', value: '@sofia.marin', chip: 'bg-sky-600' },
      { icon: MapPin, label: 'Visit my office', value: '2093 Philadelphia Pike', chip: 'bg-rose-500' },
      { icon: Mail, label: 'Email me', value: 'sofia.marin@kalm.co', chip: 'bg-indigo-500' },
    ],
  },
  {
    name: 'Marcus Reed',
    title: 'Sales Director · Nova',
    initials: 'MR',
    theme: 'bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950',
    rotate: 6,
    translateX: 95,
    translateY: 16,
    z: 10,
    hideBelow: 'sm',
    actions: [
      { icon: Phone, label: 'Call me', value: '+1 212 456 7890', chip: 'bg-emerald-500' },
      { icon: Mail, label: 'Email me', value: 'marcus.reed@novahq.com', chip: 'bg-indigo-500' },
    ],
  },
  {
    name: 'Elena Cho',
    title: 'Founder, Loop Studio',
    initials: 'EC',
    theme: 'bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-950',
    rotate: 12,
    translateX: 230,
    translateY: 36,
    z: 0,
    hideBelow: 'md',
    actions: [
      { icon: Link2, label: 'Follow me', value: '@elena.cho', chip: 'bg-sky-600' },
      { icon: Mail, label: 'Email me', value: 'elena@loopstudio.com', chip: 'bg-indigo-500' },
    ],
  },
]

export function HeroPhoneFan() {
  return (
    <div className="relative mx-auto mt-14 h-[420px] max-w-4xl sm:h-[460px] md:h-[500px]">
      <div className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-3xl" />
      <div className="absolute top-1/3 left-[20%] size-40 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute top-1/3 right-[20%] size-40 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="absolute inset-0">
        {cards.map((card) => (
          <div
            key={card.name}
            className={cn(
              'absolute top-1/2 left-1/2 w-[126px] sm:w-[148px] md:w-[168px]',
              card.hideBelow === 'sm' && 'hidden sm:block',
              card.hideBelow === 'md' && 'hidden md:block',
            )}
            style={{
              transform: `translate(-50%, -50%) translateX(${card.translateX}px) translateY(${card.translateY}px) rotate(${card.rotate}deg)`,
              zIndex: card.z,
            }}
          >
            <div
              className={cn(
                'aspect-9/19 overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-black/5',
                card.theme,
                card.emphasis && 'shadow-brand/20 scale-110 md:scale-125',
              )}
            >
              <div
                className={cn(
                  'mx-auto mt-2.5 h-3.5 w-14 rounded-full',
                  card.emphasis ? 'bg-foreground/10' : 'bg-white/15',
                )}
              />
              <div className="flex flex-col items-center gap-1.5 px-2.5 pt-4">
                <div
                  className={cn(
                    'flex size-11 items-center justify-center rounded-full text-xs font-semibold ring-2 md:size-12',
                    card.emphasis
                      ? 'bg-brand/10 text-brand ring-brand/20'
                      : 'bg-white/15 text-white ring-white/30 backdrop-blur',
                  )}
                >
                  {card.initials}
                </div>
                <p className={cn('text-center text-[11px] font-semibold', card.emphasis ? 'text-foreground' : 'text-white')}>
                  {card.name}
                </p>
                <p className={cn('text-center text-[9px] leading-tight', card.emphasis ? 'text-muted-foreground' : 'text-white/70')}>
                  {card.title}
                </p>
                <button
                  className={cn(
                    'mt-1 w-full rounded-full py-1.5 text-[9px] font-semibold',
                    card.emphasis ? 'bg-primary text-primary-foreground' : 'bg-white text-slate-900',
                  )}
                >
                  Save Contact
                </button>
                <div className="mt-1 w-full space-y-1">
                  {card.actions.map((action) => (
                    <div
                      key={action.label}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-1.5 py-1',
                        card.emphasis ? 'bg-muted' : 'bg-white/10',
                      )}
                    >
                      <span className={cn('flex size-4 shrink-0 items-center justify-center rounded-full', action.chip)}>
                        <action.icon className="size-2.5 text-white" />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className={cn('block text-[8px] font-medium', card.emphasis ? 'text-foreground' : 'text-white')}>
                          {action.label}
                        </span>
                        <span className={cn('block truncate text-[7px]', card.emphasis ? 'text-muted-foreground' : 'text-white/60')}>
                          {action.value}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-float absolute right-[8%] bottom-6 z-30 hidden items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-xl sm:flex">
        <CheckCircle2 className="size-4 text-emerald-500" />
        <span className="text-xs font-medium">Saved to contacts</span>
      </div>
    </div>
  )
}
