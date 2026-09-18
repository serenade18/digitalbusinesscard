import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, MoreVertical, Plus, Settings, Trash2, WalletCards } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteCardMutation, useListCardsQuery } from '@/features/cards/cardsApi'
import { vcardStatusTone } from '@/lib/status'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/lib/errors'

export function CardsListPage() {
  const { data, isLoading } = useListCardsQuery()
  const [deleteCard] = useDeleteCardMutation()
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)

  const cards = data?.results ?? []

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await deleteCard(pendingDelete.id).unwrap()
      toast.success(`${pendingDelete.name} deleted.`)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Cards"
        description="Every digital business card in your account."
        actions={
          <Button asChild>
            <Link to="/app/cards/new">
              <Plus /> Create card
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
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

      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
          >
            <Avatar className="size-10">
              <AvatarImage src={card.profile_photo ?? undefined} alt={card.display_name} />
              <AvatarFallback>{card.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Link to={`/app/cards/${card.id}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium hover:underline">{card.display_name}</p>
              <p className="truncate text-xs text-muted-foreground">{card.job_title || card.company_name || '—'}</p>
            </Link>
            <StatusBadge status={card.status} tone={vcardStatusTone(card.status)} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/app/cards/${card.id}`}>Open builder</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/app/cards/${card.id}/settings`}>
                    <Settings /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setPendingDelete({ id: card.id, name: card.display_name })}
                >
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pendingDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the card, its public page, and all of its content. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => void handleDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
