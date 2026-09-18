import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'
import type { ApiErrorBody } from '@/types/common'

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

/**
 * DRF error bodies vary by shape: `{"detail": "..."}`, `{"detail": {field:
 * [msg]}}` from EntitlementError-style responses, or plain field-error maps
 * like `{"email": ["already exists"]}` straight from serializer validation.
 * This flattens all of them into one readable line for a toast.
 */
export function extractErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as ApiErrorBody | string | undefined

    if (typeof data === 'string') return data
    if (data && typeof data.detail === 'string') return data.detail

    if (data && typeof data === 'object') {
      const messages: string[] = []
      for (const value of Object.values(data)) {
        if (Array.isArray(value)) messages.push(...value.map(String))
        else if (typeof value === 'string') messages.push(value)
        else if (value && typeof value === 'object') messages.push(...Object.values(value).flat().map(String))
      }
      if (messages.length > 0) return messages.join(' ')
    }

    if (error.status === 'FETCH_ERROR') return 'Could not reach the server. Check your connection.'
    if (typeof error.status === 'number') return `Request failed (${error.status}).`
  }

  const serialized = error as SerializedError | undefined
  if (serialized?.message) return serialized.message

  return fallback
}
