import { Link } from 'react-router-dom'
import { BarChart3, CalendarClock, Inbox, LayoutTemplate, QrCode, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sections = [
  {
    icon: LayoutTemplate,
    title: 'A builder that stays out of your way',
    description:
      'Add profile, bio, social links, services, products, gallery, testimonials, and booking blocks — reorder and toggle them with drag-and-drop, and watch the public page update live as you edit.',
  },
  {
    icon: QrCode,
    title: 'Share however people prefer',
    description:
      'One canonical link, a downloadable QR code, and a one-tap "save contact" — plus an NFC card if you want something physical to hand over.',
  },
  {
    icon: BarChart3,
    title: 'Know what people do with your card',
    description:
      'Views, unique visitors, link clicks, contact downloads, and enquiries — broken down by day, source, country, and device.',
  },
  {
    icon: Inbox,
    title: 'A real inbox for enquiries',
    description: 'Every message from your card lands in one place, with statuses so nothing falls through.',
  },
  {
    icon: CalendarClock,
    title: 'Bookings without the back-and-forth',
    description: 'Set your weekly availability once, list your bookable services, and let people pick a time.',
  },
  {
    icon: Users,
    title: 'Room for a team',
    description: 'Invite teammates with roles, assign cards to the right person, and manage it all centrally.',
  },
]

export function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Built for how you actually work</h1>
        <p className="mt-4 text-muted-foreground md:text-lg">
          Every part of the dashboard is designed around one thing — making your card genuinely useful, not just
          another link in a bio.
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-16">
        {sections.map((section, index) => (
          <div
            key={section.title}
            className={`flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-muted/40 md:w-1/2">
              <section.icon className="size-12 text-muted-foreground/50" />
            </div>
            <div className="flex flex-col gap-3 md:w-1/2">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 px-6 py-14 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">See it for yourself</h2>
        <Button size="lg" asChild>
          <Link to="/register">Create your card</Link>
        </Button>
      </div>
    </div>
  )
}
