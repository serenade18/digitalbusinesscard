import { useParams, Link } from 'react-router-dom'
import { Loader2, Palette, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { CardDetailsForm } from '@/features/builder/CardDetailsForm'
import { BlockList } from '@/components/builder/BlockList'
import { TemplateRenderer } from '@/components/cards/TemplateRenderer'
import { useGetCardQuery } from '@/features/cards/cardsApi'
import {
  useListBlocksQuery,
  useListGalleryItemsQuery,
  useListLinksQuery,
  useListProductsQuery,
  useListServicesQuery,
  useListTestimonialsQuery,
} from '@/features/builder/builderApi'
import { vcardStatusTone } from '@/lib/status'

export function CardBuilderPage() {
  const { cardId } = useParams<{ cardId: string }>()
  const { data: card, isLoading } = useGetCardQuery(cardId!)
  const { data: blocks } = useListBlocksQuery(cardId!)
  const { data: links } = useListLinksQuery(cardId!)
  const { data: services } = useListServicesQuery(cardId!)
  const { data: products } = useListProductsQuery(cardId!)
  const { data: testimonials } = useListTestimonialsQuery(cardId!)
  const { data: galleryItems } = useListGalleryItemsQuery(cardId!)

  if (isLoading || !card) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight">{card.display_name}</h1>
          <StatusBadge status={card.status} tone={vcardStatusTone(card.status)} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/app/cards/${card.id}/theme`}>
              <Palette /> Theme
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/app/cards/${card.id}/settings`}>
              <Settings /> Settings
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-8 rounded-2xl border border-border bg-background p-6">
          <CardDetailsForm card={card} />
          <div className="border-t border-border pt-6">
            <BlockList vcardId={card.id} />
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-center text-xs font-medium text-muted-foreground">Live preview</p>
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <TemplateRenderer
              data={{
                display_name: card.display_name,
                job_title: card.job_title,
                company_name: card.company_name,
                bio: card.bio,
                profile_photo: card.profile_photo,
                cover_photo: card.cover_photo,
                email: card.email,
                phone: card.phone,
                whatsapp: card.whatsapp,
                website: card.website,
                theme_config: card.theme_config,
                blocks: blocks ?? [],
                links: links ?? [],
                services: services ?? [],
                products: products ?? [],
                testimonials: testimonials ?? [],
                galleryItems: galleryItems ?? [],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
