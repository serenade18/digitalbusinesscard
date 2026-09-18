import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchCallInfo, mockJsonResponse, renderWithProviders } from '@/test/render'
import { BlockList } from '@/components/builder/BlockList'
import type { ProfileBlock } from '@/types/blocks'

const blocks: ProfileBlock[] = [
  {
    id: 'block-1',
    vcard: 'card-1',
    type: 'service',
    title: 'Our Services',
    content: {},
    position: 0,
    is_visible: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

afterEach(() => {
  vi.restoreAllMocks()
})

// Drag-and-drop reorder itself isn't exercised here — jsdom has no real
// pointer/layout geometry for dnd-kit to compute against. This covers the
// surrounding block CRUD (render, visibility toggle) instead.
describe('BlockList', () => {
  it('renders blocks from the API and toggles visibility via PATCH', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const { url } = fetchCallInfo([input, init])
      if (url.includes('/blocks/block-1/')) {
        return Promise.resolve(mockJsonResponse({ ...blocks[0], is_visible: false }))
      }
      return Promise.resolve(mockJsonResponse(blocks))
    })

    const user = userEvent.setup()
    renderWithProviders(<BlockList vcardId="card-1" />)

    expect(await screen.findByText('Our Services')).toBeInTheDocument()

    const row = screen.getByText('Our Services').closest('div[class*="rounded-xl"]') as HTMLElement
    const hideButton = within(row).getByTitle(/hide/i)
    await user.click(hideButton)

    await waitFor(() => {
      const patched = fetchSpy.mock.calls.some((call) => {
        const { url, method } = fetchCallInfo(call)
        return url.includes('/blocks/block-1/') && method === 'PATCH'
      })
      expect(patched).toBe(true)
    })
  })
})
