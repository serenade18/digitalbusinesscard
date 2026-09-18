import { Link } from 'react-router-dom'
import { Loader2, Nfc, Package, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useListOrdersQuery } from '@/features/orders/ordersApi'
import { useAssignNfcCardMutation, useListNfcCardsQuery } from '@/features/orders/nfcApi'
import { useListCardsQuery } from '@/features/cards/cardsApi'
import { orderStatusTone } from '@/lib/status'
import { formatDate, formatMoney, titleCase } from '@/lib/format'

export function OrdersPage() {
  const { data, isLoading } = useListOrdersQuery()
  const { data: nfcCards, isLoading: isLoadingNfc } = useListNfcCardsQuery()
  const { data: cardsData } = useListCardsQuery()
  const [assignNfcCard] = useAssignNfcCardMutation()

  const orders = data?.results ?? []
  const cards = cardsData?.results ?? []

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Physical NFC cards — order status and linking."
        actions={
          <Button asChild>
            <Link to="/app/orders/new">
              <Plus /> Order a card
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Order a physical NFC card that taps your digital card open."
          action={
            <Button asChild size="sm">
              <Link to="/app/orders/new">
                <Plus /> Order a card
              </Link>
            </Button>
          }
        />
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={order.status} tone={orderStatusTone(order.status)} />
                <span className="text-sm font-medium">{formatMoney(order.total, order.currency)}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
              {order.items.map((item) => (
                <p key={item.id}>
                  {item.quantity}× {item.product.name} ({titleCase(item.product.material)})
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Nfc className="size-4" /> Your NFC cards
        </h2>
        {isLoadingNfc && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
        {!isLoadingNfc && nfcCards?.length === 0 && <p className="text-sm text-muted-foreground">No NFC cards yet.</p>}
        <div className="flex flex-col gap-2">
          {nfcCards?.map((nfc) => (
            <div key={nfc.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{titleCase(nfc.material)} card</p>
                <p className="truncate text-xs text-muted-foreground">Serial: {nfc.serial_number || nfc.uid}</p>
              </div>
              <StatusBadge status={nfc.status} tone={nfc.status === 'active' ? 'success' : 'neutral'} />
              {(nfc.status === 'inventory' || nfc.status === 'reserved' || nfc.status === 'assigned') && (
                <Select
                  value={nfc.vcard ?? undefined}
                  onValueChange={(vcardId) => void assignNfcCard({ id: nfc.id, vcardId })}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Link to a card" />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
