import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchCallInfo, mockJsonResponse, renderWithProviders } from '@/test/render'
import { CardSettingsPage } from '@/pages/cards/CardSettingsPage'
import type { VCard } from '@/types/cards'

const draftCard: VCard = {
  id: 'card-1',
  organization: null,
  owner: 'user-1',
  assigned_user: null,
  slug: 'jane-doe',
  display_name: 'Jane Doe',
  job_title: '',
  company_name: '',
  bio: '',
  profile_photo: null,
  cover_photo: null,
  email: '',
  phone: '',
  whatsapp: '',
  website: '',
  address: '',
  location: '',
  industry: '',
  template: null,
  theme_config: {
    primaryColor: '#111827',
    secondaryColor: '#6B7280',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    buttonStyle: 'rounded',
    cardStyle: 'glass',
    fontFamily: 'Inter',
    borderRadius: 'lg',
  },
  visibility: 'public',
  status: 'draft',
  is_featured: false,
  is_verified: false,
  is_directory_visible: false,
  public_url: 'https://domain.com/@jane-doe',
  published_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CardSettingsPage', () => {
  it('publishes a draft card', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const { url } = fetchCallInfo([input, init])
      if (url.includes('/publish/')) {
        return Promise.resolve(mockJsonResponse({ ...draftCard, status: 'published' }))
      }
      if (url.includes('/members/')) {
        return Promise.resolve(mockJsonResponse([]))
      }
      return Promise.resolve(mockJsonResponse(draftCard))
    })

    const user = userEvent.setup()
    renderWithProviders(<CardSettingsPage />, {
      route: '/app/cards/card-1/settings',
      routePath: '/app/cards/:cardId/settings',
    })

    const publishButton = await screen.findByRole('button', { name: /^publish$/i })
    await user.click(publishButton)

    await waitFor(() => {
      const published = fetchSpy.mock.calls.some((call) => {
        const { url, method } = fetchCallInfo(call)
        return url.includes('/vcards/card-1/publish/') && method === 'POST'
      })
      expect(published).toBe(true)
    })
  })
})
