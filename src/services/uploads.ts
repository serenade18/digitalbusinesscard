/**
 * Builds a multipart FormData body for endpoints that accept an image file
 * (VCard.profile_photo/cover_photo, Service/Product/Testimonial/GalleryItem
 * image fields, Organization.logo, User.avatar). `fetchBaseQuery` leaves
 * FormData bodies untouched (no JSON content-type), so the browser sets the
 * correct multipart boundary itself.
 *
 * Only string/number/boolean/File values are appended — `undefined`/`null`
 * fields are skipped so a PATCH doesn't clobber existing values.
 */
export function toFormData<T extends object>(payload: T): FormData {
  const formData = new FormData()

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue

    if (value instanceof File) {
      formData.append(key, value)
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}

export function hasFile<T extends object>(payload: T): boolean {
  return Object.values(payload).some((value) => value instanceof File)
}
