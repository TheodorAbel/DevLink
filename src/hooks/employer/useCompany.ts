import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export type CompanyBundle = {
  company: {
    id: string
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
    verification_status?: string | null
    is_verified?: boolean | null
    registration_document_url?: string | null
    business_license_url?: string | null
    remote_policy?: string | null
    linkedin_url?: string | null
    twitter_url?: string | null
    facebook_url?: string | null
    github_url?: string | null
    youtube_url?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    show_employees?: boolean | null
    show_culture?: boolean | null
    show_media?: boolean | null
    show_leadership?: boolean | null
    show_hiring?: boolean | null
    show_contacts?: boolean | null
    show_socials?: boolean | null
    is_active?: boolean | null
    hiring_process?: string | null
    created_at?: string
    updated_at?: string
  } | null
  leaders: Array<{ id: string; name: string; title: string; photo_url?: string | null; linkedin_url?: string | null; display_order?: number | null }>
  media: Array<{ id: string; media_type: string; url: string; title?: string | null; thumbnail_url?: string | null; file_size?: number | null; duration_seconds?: number | null; display_order?: number | null }>
  culture_values: Array<{ id: string; title: string; description?: string | null; display_order?: number | null }>
  job_defaults: { salary_type?: string | null; remote_work?: string | null; currency?: string | null } | null
  billing: { billing_email?: string | null; plan?: string | null; status?: string | null; payment_method_status?: string | null } | null
}

export function useCompany() {
  return useQuery<CompanyBundle>({
    queryKey: ['company'],
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return { company: null, leaders: [], media: [], culture_values: [], job_defaults: null, billing: null }
      const res = await fetch('/api/company/profile', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to fetch company profile')
      const json = await res.json()
      return json as CompanyBundle
    },
  })
}
