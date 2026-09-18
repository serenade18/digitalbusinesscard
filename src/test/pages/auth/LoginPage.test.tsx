import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestStore, fetchCallInfo, readFetchJsonBody, renderWithProviders } from '@/test/render'
import { LoginPage } from '@/pages/auth/LoginPage'

describe('LoginPage', () => {
  it('shows validation errors instead of submitting an empty form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { store: createTestStore({ status: 'anonymous', user: null, accessToken: null }) })

    await user.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('renders the register and forgot-password links', () => {
    renderWithProviders(<LoginPage />, { store: createTestStore({ status: 'anonymous', user: null, accessToken: null }) })

    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument()
  })

  it('submits credentials and lets the request resolve', async () => {
    const fetchSpy = vitestFetchSpy()
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { store: createTestStore({ status: 'anonymous', user: null, accessToken: null }) })

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/password/i), 'correct horse battery staple')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled())
    const { url, method } = fetchCallInfo(fetchSpy.mock.calls[0])
    expect(url).toContain('/auth/login/')
    expect(method).toBe('POST')
    const body = await readFetchJsonBody(fetchSpy.mock.calls[0])
    expect(body).toMatchObject({ email: 'jane@example.com' })

    fetchSpy.mockRestore()
  })
})

function vitestFetchSpy() {
  const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ detail: 'Invalid credentials.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  return spy
}
