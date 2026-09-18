export interface Paginated<T> {
  count: number
  num_pages: number
  current_page: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiErrorBody {
  detail?: string | Record<string, string[]>
  code?: string
  [key: string]: unknown
}

export type Currency = string
