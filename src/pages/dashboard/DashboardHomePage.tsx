import { Link } from 'react-router-dom'
import { Loader2, Plus, WalletCards } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useListCardsQuery } from '@/features/cards/cardsApi'
import { useAppSelector } from '@/hooks/redux'
import { vcardStatusTone } from '@/lib/status'

export function DashboardHomePage() {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading } = useListCardsQuery()
  const cards = data?.results ?? []
  const publishedCount = cards.filter((c) => c.status === 'published').length

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.first_name ? `, ${user.first_name}` : ''}`}
        description="Here's what's happening across your cards."
        actions={
          <Button asChild>
            <Link to="/app/cards/new">
              <Plus /> Create card
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total cards" value={isLoading ? '—' : cards.length} icon={WalletCards} />
        <StatCard label="Published" value={isLoading ? '—' : publishedCount} />
        <StatCard label="Drafts" value={isLoading ? '—' : cards.length - publishedCount} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Your cards</h2>
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && cards.length === 0 && (
          <EmptyState
            icon={WalletCards}
            title="No cards yet"
            description="Create your first digital business card to get started."
            action={
              <Button asChild size="sm">
                <Link to="/app/cards/new">
                  <Plus /> Create card
                </Link>
              </Button>
            }
          />
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.slice(0, 6).map((card) => (
            <Link
              key={card.id}
              to={`/app/cards/${card.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-foreground/30"
            >
              <Avatar className="size-10">
                <AvatarImage src={card.profile_photo ?? undefined} alt={card.display_name} />
                <AvatarFallback>{card.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{card.display_name}</p>
                <p className="truncate text-xs text-muted-foreground">{card.job_title || card.company_name || '—'}</p>
              </div>
              <StatusBadge status={card.status} tone={vcardStatusTone(card.status)} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
