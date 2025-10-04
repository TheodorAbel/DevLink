export type CompanyProfilePayload = {
  // Main company fields
  company_name: string
  logo_url?: string | null
  cover_image_url?: string | null
  website_url?: string | null
  industry: string
  company_size: string
  founded_year?: number | null
  headquarters?: string | null
  registration_number?: string | null
  tax_id?: string | null
  country: string
  city: string
  address?: string | null
  tagline?: string | null
  description: string
  culture?: string | null
  specialties?: string[] | null
  benefits?: string[] | null
  remote_policy?: string | null
  linkedin_url?: string | null
  twitter_url?: string | null
  facebook_url?: string | null
  github_url?: string | null
  youtube_url?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  show_employees?: boolean
  show_culture?: boolean
  show_media?: boolean
  show_leadership?: boolean
  show_hiring?: boolean
  show_contacts?: boolean
  show_socials?: boolean
  hiring_process?: string | null

  // Sub-entities (replace-all semantics when provided)
  culture_values?: Array<{
    id?: string
    title: string
    description?: string | null
    display_order?: number
  }>

  leaders?: Array<{
    id?: string
    name: string
    title: string
    photo_url?: string | null
    linkedin_url?: string | null
    display_order?: number
  }>

  media?: Array<{
    id?: string
    media_type: 'image' | 'video'
    url: string
    title?: string | null
    thumbnail_url?: string | null
    file_size?: number | null
    duration_seconds?: number | null
    display_order?: number
  }>

  job_defaults?: {
    salary_type?: string | null
    remote_work?: string | null
    currency?: string | null
  } | null

  billing?: {
    stripe_customer_id?: string | null
    billing_email?: string | null
    plan?: string | null
    status?: string | null
    payment_method_status?: string | null
  } | null

  message_templates?: Array<{
    id?: string
    name: string
    subject: string
    content: string
  }>
}
