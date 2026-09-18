import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { VCardListItem } from '@/types/cards'

export function VCardSelect({
  cards,
  value,
  onChange,
}: {
  cards: VCardListItem[]
  value: string | null
  onChange: (id: string) => void
}) {
  return (
    <Select value={value ?? undefined} onValueChange={onChange}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a card" />
      </SelectTrigger>
      <SelectContent>
        {cards.map((card) => (
          <SelectItem key={card.id} value={card.id}>
            {card.display_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
