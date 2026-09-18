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

/** Lets a create/update payload pass a `File` for image fields that the
 * read model types as a plain `string` URL. */
export type WithUpload<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] | File }
