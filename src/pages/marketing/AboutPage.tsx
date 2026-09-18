export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">About DBC</h1>
      <div className="mt-8 flex flex-col gap-5 text-muted-foreground">
        <p>
          Paper business cards get lost in a drawer. DBC gives you one link instead — a card that stays up to
          date, shows you who's actually engaging with it, and works for a solo freelancer or a whole team.
        </p>
        <p>
          We built the dashboard around the parts of running a card that get tedious fast: keeping contact
          details current across a dozen printed cards, chasing enquiries scattered across inboxes, and having
          no idea whether anyone actually looks at the thing.
        </p>
        <p>Everything here — templates, analytics, bookings, team roles — is meant to stay out of your way.</p>
      </div>
    </div>
  )
}
