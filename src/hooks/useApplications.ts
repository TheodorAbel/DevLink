import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export type ApplicationItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'applied' | 'viewed' | 'interview' | 'accepted' | 'rejected' | 'pending';
};

type RawApplication = { id: string; job_id: string; status: ApplicationItem['status']; created_at: string };

type JobRow = { id: string; title?: string | null; location?: string | null; companies?: { company_name?: string | null } | null };

export function useApplications() {
  return useQuery({
    queryKey: ['applications', { limit: 12 }],
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    queryFn: async (): Promise<ApplicationItem[]> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return [];
      const res = await fetch('/api/applications?limit=12', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return [];
      const j = await res.json();
      interface RawApp { id: string; job_id: string; status: string; created_at: string; jobs?: unknown }
      const list: RawApp[] = Array.isArray(j.applications) ? j.applications : [];
      if (!list.length) return [];
      const now = new Date();
      // If API provided joined jobs, map directly for speed
      if (list[0] && typeof list[0] === 'object' && 'jobs' in list[0]) {
        return list.map((a) => {
          const job = a.jobs as { id?: string; title?: string | null; location?: string | null; companies?: { company_name?: string | null } | null } | null;
          return {
            id: a.id as string,
            jobId: (a.job_id as string) || (job?.id as string),
            jobTitle: job?.title || 'Job',
            company: (job?.companies?.company_name) || 'Company',
            location: job?.location || '—',
            appliedDate: (a.created_at as string) || now.toISOString(),
            status: (a.status as ApplicationItem['status']) || 'pending',
          } satisfies ApplicationItem;
        });
      }
      // Fallback: legacy path fetches jobs once
      const jobIds = (list as RawApplication[]).map(a => a.job_id);
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, title, location, companies:company_id ( company_name )')
        .in('id', jobIds);
      const byId = new Map((jobs || []).map(jr => [jr.id as string, jr as JobRow] as const));
      return (list as RawApplication[]).map((a) => {
        const job = byId.get(a.job_id) as JobRow | undefined;
        return {
          id: a.id,
          jobId: a.job_id,
          jobTitle: job?.title || 'Job',
          company: job?.companies?.company_name || 'Company',
          location: job?.location || '—',
          appliedDate: a.created_at || now.toISOString(),
          status: a.status || 'pending',
        } as ApplicationItem;
      });
    },
  });
}

export function useApplicationByJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ['applicationByJobDetailed', jobId],
    enabled: !!jobId,
    queryFn: async (): Promise<{
      app: { id: string; status: ApplicationItem['status']; created_at: string; coverLetter?: string | null; resumeUrl?: string | null } | null;
      job: { title: string; company: string; location: string | null; salary?: string; type?: string } | null;
    }> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token || !jobId) return { app: null, job: null };
      const res = await fetch(`/api/applications?jobId=${encodeURIComponent(jobId)}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return { app: null, job: null };
      const j = await res.json();
      const app = {
        id: j.id,
        status: j.status as ApplicationItem['status'],
        created_at: j.created_at || new Date().toISOString(),
        coverLetter: j.coverLetter,
        resumeUrl: j.resumeUrl,
      } as const;
      const { data: jobRow } = await supabase
        .from('jobs')
        .select('title, job_type, salary_type, salary_min, salary_max, salary_fixed, salary_currency, custom_salary_message, location, companies:company_id ( company_name )')
        .eq('id', jobId)
        .maybeSingle();
      let salary = 'Competitive';
      if (jobRow?.salary_type === 'range' && jobRow?.salary_min && jobRow?.salary_max) {
        salary = `${jobRow.salary_currency || 'ETB'} ${jobRow.salary_min} - ${jobRow.salary_max}`;
      } else if (jobRow?.salary_type === 'fixed' && jobRow?.salary_fixed) {
        salary = `${jobRow.salary_currency || 'ETB'} ${jobRow.salary_fixed}`;
      } else if (jobRow?.custom_salary_message) {
        salary = jobRow.custom_salary_message;
      }
      const typeMap: Record<string, string> = { full_time: 'Full-time', part_time: 'Part-time', contract: 'Contract', internship: 'Internship' };
      const job = {
        title: jobRow?.title || 'Job',
        company: (jobRow && typeof jobRow === 'object' && 'companies' in jobRow && (jobRow as { companies?: { company_name?: string } | null }).companies?.company_name) || 'Company',
        location: jobRow?.location || '—',
        salary,
        type: typeMap[jobRow?.job_type || ''] || jobRow?.job_type || 'Full-time',
      } as const;
      return { app, job };
    },
  });
}

export function useApplyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { jobId: string; coverLetter: string; resumeUrl?: string; answers: Array<{ questionId: string; answerText?: string; selectedOptions?: string[] }> }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // if conflict, try update
        if (res.status === 409) {
          const upd = await fetch('/api/applications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });
          if (!upd.ok) {
            const j2 = await upd.json().catch(() => ({}));
            throw new Error(j2?.error || 'Failed to update application');
          }
          return true as const;
        }
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || 'Failed to submit application');
      }
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
