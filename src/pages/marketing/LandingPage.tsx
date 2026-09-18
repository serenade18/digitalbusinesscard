import { Link } from 'react-router-dom'
import { BarChart3, CalendarClock, Palette, QrCode, Share2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroPhoneFan } from './HeroPhoneFan'
import { HowItWorksShowcase } from './HowItWorksShowcase'

const features = [
  {
    icon: Palette,
    title: 'Design it your way',
    description: 'Pick a template, tune the colors and layout, and preview the public page as you build it.',
  },
  {
    icon: Share2,
    title: 'Share in one tap',
    description: 'A single link or QR code carries your contact details, socials, services, and more.',
  },
  {
    icon: BarChart3,
    title: 'See what lands',
    description: 'Views, link clicks, and enquiries — know which parts of your card people actually use.',
  },
  {
    icon: CalendarClock,
    title: 'Take bookings',
    description: 'Set your availability and let visitors book time with you straight from your card.',
  },
  {
    icon: Users,
    title: 'Built for teams',
    description: 'Invite teammates, assign cards, and manage everyone from one dashboard.',
  },
  {
    icon: QrCode,
    title: 'Physical, too',
    description: 'Order an NFC card that taps your digital card open on any phone.',
  },
]

export function LandingPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl overflow-hidden px-4 pt-16 pb-8 text-center md:px-8 md:pt-24 md:pb-12">
        <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Your whole professional identity.
          <br />
          One link.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
          Build a digital business card that shares your contact info, services, and socials — and shows you
          exactly who's engaging with it.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/register">Create your card</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/features">See how it works</Link>
          </Button>
        </div>

        <HeroPhoneFan />
      </section>

      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Everything on one card</h2>
            <p className="mt-2 text-muted-foreground">The pieces you need to make a strong first impression.</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">How it works.</h2>

        <div className="mt-12">
          <HowItWorksShowcase />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:items-end">
            <p className="text-base font-medium text-foreground sm:text-lg">
              A digital card isn't just a link — it lives right where you already reach for your ID, your
              tickets, your cards.
            </p>
            <p className="text-sm text-muted-foreground sm:text-right">
              It replaces the awkward card fumble with a single tap, scan, or glance.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Ready to make your card?</h2>
          <p className="max-w-md text-muted-foreground">It takes a few minutes to set up — free to start.</p>
          <Button size="lg" asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
