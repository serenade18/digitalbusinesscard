export interface DirectoryEntry {
  slug: string
  display_name: string
  job_title: string
  company_name: string
  location: string
  industry: string
  bio: string
  profile_photo: string | null
  is_verified: boolean
}

export interface DirectoryVisibilityPayload {
  is_directory_visible?: boolean
  industry?: string
}
