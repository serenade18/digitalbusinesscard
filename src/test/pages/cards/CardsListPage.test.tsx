import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { mockJsonResponse, renderWithProviders } from '@/test/render'
import { CardsListPage } from '@/pages/cards/CardsListPage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CardsListPage', () => {
  it('shows an empty state when the user has no cards', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockJsonResponse({ count: 0, num_pages: 0, current_page: 1, next: null, previous: null, results: [] }),
    )

    renderWithProviders(<CardsListPage />)

    expect(await screen.findByText(/no cards yet/i)).toBeInTheDocument()
  })

  it('lists cards returned by the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockJsonResponse({
        count: 1,
        num_pages: 1,
        current_page: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 'card-1',
            slug: 'jane-doe',
            display_name: 'Jane Doe',
            job_title: 'Product Designer',
            company_name: 'Acme',
            profile_photo: null,
            status: 'published',
            visibility: 'public',
            is_featured: false,
            is_verified: false,
            organization: null,
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
          },
        ],
      }),
    )

    renderWithProviders(<CardsListPage />)

    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument())
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
    expect(screen.getByText(/published/i)).toBeInTheDocument()
  })
})
