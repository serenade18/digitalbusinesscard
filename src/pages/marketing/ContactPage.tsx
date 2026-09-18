import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Get in touch</h1>
      <p className="mt-4 text-muted-foreground md:text-lg">
        Questions about your account, billing, or anything else — we're happy to help.
      </p>
      <Button size="lg" className="mt-8" asChild>
        <a href="mailto:support@dbc.app">
          <Mail /> support@dbc.app
        </a>
      </Button>
    </div>
  )
}
