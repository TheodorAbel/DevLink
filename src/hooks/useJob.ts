import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export type DbJob = {
  id: string;
  title: string;
  location: string | null;
  job_type: string | null;
  salary_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_fixed: number | null;
  salary_currency: string | null;
  custom_salary_message: string | null;
  description: string | null;
  requirements: string[] | null;
  responsibilities: string[] | null;
  skills_required: string[] | null;
  application_deadline: string | null;
  published_at: string | null;
  company_id: string;
  companies?: {
    company_name: string | null;
    description: string | null;
    company_size: string | null;
    industry: string | null;
    founded_year: number | null;
    website_url: string | null;
    benefits: string[] | null;
    headquarters: string | null;
  } | null;
};

export function useJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ['job', jobId],
    enabled: !!jobId,
    queryFn: async (): Promise<DbJob | null> => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, title, location, job_type, salary_type, salary_min, salary_max, salary_fixed, salary_currency, custom_salary_message,
          description, requirements, responsibilities, skills_required, application_deadline, published_at, company_id,
          companies:company_id ( company_name, description, company_size, industry, founded_year, website_url, benefits, headquarters )
        `)
        .eq('id', jobId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as unknown as DbJob) ?? null;
    },
  });
}

export function useHasApplied(jobId: string | undefined) {
  return useQuery({
    queryKey: ['applicationByJob', jobId],
    enabled: !!jobId,
    queryFn: async (): Promise<boolean> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return false;
      const res = await fetch(`/api/applications?jobId=${encodeURIComponent(jobId || '')}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return false;
      const j = await res.json();
      return j && j.status === 'applied';
    },
    staleTime: 15_000,
  });
}
