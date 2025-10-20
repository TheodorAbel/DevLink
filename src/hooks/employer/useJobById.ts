import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export type JobDetail = {
  id: string
  title: string
  location: string | null
  job_type: string | null
  experience_level: string | null
  description: string | null
  salary_type: string | null
  salary_min: number | null
  salary_max: number | null
  salary_fixed: number | null
  salary_currency: string | null
  custom_salary_message: string | null
  status: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  is_remote: boolean | null
  remote_policy: string | null
  application_deadline: string | null
  requirements: string[] | null
  responsibilities: string[] | null
  qualifications: string[] | null
  benefits: string[] | null
  skills_required: string[] | null
  application_method: string | null
  application_url: string | null
  application_email: string | null
  company_id: string | null
}

export function useJobById(jobId: string | null) {
  return useQuery<JobDetail | null>({
    queryKey: ['job', jobId],
    enabled: !!jobId, // Only run query if jobId exists
    staleTime: 5 * 60_000, // 5 minutes
    gcTime: 10 * 60_000, // 10 minutes
    queryFn: async () => {
      if (!jobId) return null

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('Not authenticated')
      }

      const res = await fetch(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to fetch job')
      }

      const { job } = await res.json()
      return job as JobDetail
    },
  })
}
