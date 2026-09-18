import { Globe, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field } from '@/components/forms/Field'
import { useGetCardQuery, useListCardsQuery, useUpdateCardMutation } from '@/features/cards/cardsApi'
import { useUpdateDirectoryVisibilityMutation } from '@/features/directory/directoryApi'

function DirectoryCardRow({ vcardId }: { vcardId: string }) {
  const { data: card } = useGetCardQuery(vcardId)
  const [updateVisibility] = useUpdateDirectoryVisibilityMutation()
  const [updateCard] = useUpdateCardMutation()

  if (!card) {
    return <div className="h-24 animate-pulse rounded-2xl border border-border bg-muted/30" />
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{card.display_name}</p>
          <p className="text-xs text-muted-foreground">{card.job_title || card.company_name}</p>
        </div>
        <Switch
          checked={card.is_directory_visible}
          onCheckedChange={(checked) => void updateVisibility({ vcardId: card.id, body: { is_directory_visible: checked } })}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Field label="Industry / category" optional>
          <Input
            key={`industry-${card.id}`}
            defaultValue={card.industry}
            placeholder="e.g. Real Estate"
            onBlur={(e) => void updateVisibility({ vcardId: card.id, body: { industry: e.target.value } })}
          />
        </Field>
        <Field label="Location" optional>
          <Input
            key={`location-${card.id}`}
            defaultValue={card.location}
            placeholder="e.g. Nairobi, Kenya"
            onBlur={(e) => void updateCard({ id: card.id, body: { location: e.target.value } })}
          />
        </Field>
      </div>
    </div>
  )
}

export function DirectoryManagementPage() {
  const { data, isLoading } = useListCardsQuery()
  const cards = data?.results ?? []

  return (
    <div>
      <PageHeader
        title="Directory"
        description="Control whether and how your cards appear in the public directory."
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && cards.length === 0 && <EmptyState icon={Globe} title="No cards yet" />}

      <div className="flex flex-col gap-3">
        {cards.map((card) => (
          <DirectoryCardRow key={card.id} vcardId={card.id} />
        ))}
      </div>
    </div>
  )
}
