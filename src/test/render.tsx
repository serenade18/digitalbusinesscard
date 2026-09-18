import type { ReactElement, ReactNode } from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider as ReduxProvider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'
import { baseApi } from '@/services/api'
import authReducer from '@/features/auth/authSlice'
import activeOrgReducer from '@/features/organizations/activeOrgSlice'
import type { AuthStatus } from '@/features/auth/authSlice'
import type { User } from '@/types/auth'

export function createTestStore(authOverrides?: { status?: AuthStatus; user?: User | null; accessToken?: string | null }) {
  return configureStore({
    reducer: {
      auth: authReducer,
      activeOrg: activeOrgReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState: authOverrides
      ? {
          auth: {
            status: authOverrides.status ?? 'authenticated',
            user: authOverrides.user ?? null,
            accessToken: authOverrides.accessToken ?? 'test-access-token',
          },
        }
      : undefined,
  })
}

export function renderWithProviders(
  ui: ReactElement,
  {
    store = createTestStore(),
    route = '/',
    routePath,
  }: { store?: ReturnType<typeof createTestStore>; route?: string; routePath?: string } = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {routePath ? <Routes>{<Route path={routePath} element={children} />}</Routes> : children}
        </MemoryRouter>
      </ReduxProvider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper }) }
}

export function mockJsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

/**
 * The platform fetch is sometimes invoked as `fetch(url, init)` and
 * sometimes as `fetch(request)` depending on the request shape — normalize
 * a recorded `vi.spyOn(globalThis, 'fetch')` call to `{ url, method }` so
 * tests don't have to care which form was used.
 */
export function fetchCallInfo(call: unknown[]): { url: string; method: string } {
  const [input, init] = call as [string | Request, RequestInit | undefined]
  if (input instanceof Request) {
    return { url: input.url, method: input.method }
  }
  return { url: String(input), method: init?.method ?? 'GET' }
}

/** Reads the JSON body off a recorded fetch call, whichever form it was made in. */
export async function readFetchJsonBody(call: unknown[]): Promise<unknown> {
  const [input, init] = call as [string | Request, RequestInit | undefined]
  if (input instanceof Request) {
    return input.clone().json()
  }
  return JSON.parse(init?.body as string)
}
