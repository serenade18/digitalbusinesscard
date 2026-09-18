import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useListCardsQuery } from '@/features/cards/cardsApi'

/**
 * Several pages (Analytics, Enquiries, Appointments, Directory) operate on
 * one card at a time, selected via a `?vcard=` query param so the choice is
 * shareable/bookmarkable. Defaults to the user's first card once cards load.
 */
export function useSelectedVCard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading } = useListCardsQuery()
  const cards = data?.results ?? []
  const vcardId = searchParams.get('vcard')

  useEffect(() => {
    if (!vcardId && cards.length > 0) {
      const next = new URLSearchParams(searchParams)
      next.set('vcard', cards[0].id)
      setSearchParams(next, { replace: true })
    }
  }, [vcardId, cards.length, searchParams, setSearchParams])

  function setVCardId(id: string) {
    const next = new URLSearchParams(searchParams)
    next.set('vcard', id)
    setSearchParams(next)
  }

  return { vcardId, setVCardId, cards, isLoading }
}
