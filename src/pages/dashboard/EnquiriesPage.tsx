import { useState } from 'react'
import { Archive, Inbox, Loader2, Mail, Phone } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { VCardSelect } from '@/components/cards/VCardSelect'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useSelectedVCard } from '@/features/cards/useSelectedVCard'
import { useListEnquiriesQuery, useUpdateEnquiryStatusMutation } from '@/features/enquiries/enquiriesApi'
import { enquiryStatusTone } from '@/lib/status'
import { formatDateTime } from '@/lib/format'
import type { EnquiryStatus } from '@/types/enquiries'

const statuses: { value: EnquiryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
]

export function EnquiriesPage() {
  const { vcardId, setVCardId, cards, isLoading: isLoadingCards } = useSelectedVCard()
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all')

  const { data, isLoading } = useListEnquiriesQuery(
    vcardId ? { vcard: vcardId, status: statusFilter === 'all' ? undefined : statusFilter } : undefined,
    { skip: !vcardId },
  )
  const [updateStatus] = useUpdateEnquiryStatusMutation()

  const enquiries = data?.results ?? []

  return (
    <div>
      <PageHeader
        title="Enquiries"
        description="Messages sent through your cards."
        actions={!isLoadingCards && <VCardSelect cards={cards} value={vcardId} onChange={setVCardId} />}
      />

      {!isLoadingCards && cards.length === 0 && (
        <EmptyState title="No cards yet" description="Create a card to start receiving enquiries." />
      )}

      {cards.length > 0 && (
        <div className="flex flex-col gap-4">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as EnquiryStatus | 'all')}>
            <TabsList>
              {statuses.map((s) => (
                <TabsTrigger key={s.value} value={s.value}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && enquiries.length === 0 && <EmptyState icon={Inbox} title="No enquiries" />}

          <div className="flex flex-col gap-2">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{enquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(enquiry.created_at)}</p>
                  </div>
                  <StatusBadge status={enquiry.status} tone={enquiryStatusTone(enquiry.status)} />
                </div>
                <p className="text-sm">{enquiry.message}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`mailto:${enquiry.email}`}
                      onClick={() => {
                        if (enquiry.status === 'new') void updateStatus({ id: enquiry.id, status: 'read' })
                      }}
                    >
                      <Mail /> {enquiry.email}
                    </a>
                  </Button>
                  {enquiry.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${enquiry.phone}`}>
                        <Phone /> {enquiry.phone}
                      </a>
                    </Button>
                  )}
                  {enquiry.status !== 'replied' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void updateStatus({ id: enquiry.id, status: 'replied' })}
                    >
                      Mark replied
                    </Button>
                  )}
                  {enquiry.status !== 'archived' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void updateStatus({ id: enquiry.id, status: 'archived' })}
                    >
                      <Archive /> Archive
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
