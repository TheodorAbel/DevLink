import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export type EmployerJobRow = {
  id: string
  title: string
  location: string | null
  job_type: string | null
  description: string | null
  salary_type: string | null
  salary_min: number | null
  salary_max: number | null
  salary_fixed: number | null
  salary_currency: string | null
  status: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  views_count: number | null
  applications_count: number | null
}

export function useEmployerJobs(limit = 20) {
  return useQuery<EmployerJobRow[]>({
    queryKey: ['employer-jobs', { limit }],
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return []
      const res = await fetch(`/api/employer/jobs?limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to fetch employer jobs')
      const j = await res.json()
      return Array.isArray(j.jobs) ? (j.jobs as EmployerJobRow[]) : []
    },
  })
}
