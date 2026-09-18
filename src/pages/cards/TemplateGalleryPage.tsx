import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useListTemplatesQuery } from '@/features/templates/templatesApi'
import { useListCardsQuery, useUpdateCardMutation } from '@/features/cards/cardsApi'
import { useGetSubscriptionQuery } from '@/features/billing/billingApi'
import { extractErrorMessage } from '@/lib/errors'
import type { CardTemplate } from '@/types/templates'

export function TemplateGalleryPage() {
  const { data: templates, isLoading } = useListTemplatesQuery()
  const { data: cards } = useListCardsQuery()
  const { data: subscription } = useGetSubscriptionQuery()
  const [updateCard] = useUpdateCardMutation()
  const [picking, setPicking] = useState<CardTemplate | null>(null)
  const navigate = useNavigate()

  const hasPremiumAccess = Number(subscription?.plan.monthly_price ?? 0) > 0

  function handleClick(template: CardTemplate) {
    if (template.is_premium && !hasPremiumAccess) {
      toast.error('This template requires a paid plan.')
      return
    }
    setPicking(template)
  }

  async function applyTemplate(cardId: string) {
    if (!picking) return
    try {
      await updateCard({ id: cardId, body: { template: picking.id } }).unwrap()
      toast.success('Template applied.')
      navigate(`/app/cards/${cardId}/theme`)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    } finally {
      setPicking(null)
    }
  }

  return (
    <div>
      <PageHeader title="Templates" description="Browse layouts — pick one to apply to any of your cards." />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {templates?.results.map((template) => {
          const locked = template.is_premium && !hasPremiumAccess
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => handleClick(template)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border text-left transition-colors hover:border-foreground/40"
            >
              <div className="relative flex aspect-[3/4] items-center justify-center bg-muted">
                {template.preview_image ? (
                  <img src={template.preview_image} alt={template.name} className="size-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No preview</span>
                )}
                {locked && (
                  <span className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                    <Lock className="size-5 text-muted-foreground" />
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2.5">
                <span className="truncate text-sm font-medium">{template.name}</span>
                {template.is_premium && (
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    Premium
                  </Badge>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <Dialog open={!!picking} onOpenChange={(open) => !open && setPicking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply "{picking?.name}" to which card?</DialogTitle>
            <DialogDescription>This replaces the card's current template.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            {cards?.results.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => void applyTemplate(card.id)}
                className="rounded-lg border border-border p-2.5 text-left text-sm hover:border-foreground/40"
              >
                {card.display_name}
              </button>
            ))}
            {cards?.results.length === 0 && (
              <p className="text-sm text-muted-foreground">You don't have any cards yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
