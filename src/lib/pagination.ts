import type { Paginated } from '@/types/common'

/**
 * DRF's `StandardResultsPagination` is wired up globally, so every list
 * endpoint returns `{results: [...]}` unless a view explicitly opts out —
 * including small per-card lists (blocks, services, links, …) that read
 * like they'd just return a bare array. Some custom `@action`s bypass
 * pagination and DO return a bare array. This normalizes either shape to
 * a plain array so callers never have to care which one a given endpoint
 * uses.
 */
export function unwrapResults<T>(response: T[] | Paginated<T>): T[] {
  return Array.isArray(response) ? response : response.results
}
