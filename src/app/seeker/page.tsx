import SeekerPageClientWrapper from '@/components/SeekerPageInnerClient';
import { Job } from '@/components/JobCard';
import { headers } from 'next/headers';

export const revalidate = 0;

export default async function SeekerPage() {
  // Use built-in fetch on the server (no useEffect)
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('host') ?? 'localhost:3000';
  const apiUrl = `${proto}://${host}/api/jobs/recent`;
  const res = await fetch(apiUrl, { cache: 'no-store' });
  let recent: unknown[] = [];
  if (res.ok) {
    const json = await res.json();
    recent = json?.jobs ?? [];
  }

  interface RawJob {
    id: string;
    title: string;
    company_id: string;
    location: string | null;
    job_type: string | null;
    description: string | null;
    skills_required: string[] | null;
    published_at: string | null;
    companies?: { company_name?: string };
  }
  
  const initialRecentJobs: Job[] = (recent as RawJob[]).map((j) => {
    const typeMap: Record<string, string> = {
      full_time: 'Full-time',
      part_time: 'Part-time',
      contract: 'Contract',
      internship: 'Internship',
    };
    return {
      id: j.id,
      title: j.title,
      company: j.companies?.company_name || 'Company',
      companyId: j.company_id,
      location: j.location ?? '—',
      salary: 'Competitive',
      type: typeMap[j.job_type ?? ''] || j.job_type || 'Full-time',
      postedDate: j.published_at ? new Date(j.published_at).toLocaleDateString() : 'Recently',
      description: j.description || '',
      skills: Array.isArray(j.skills_required) ? j.skills_required : [],
    } as Job;
  });

  return <SeekerPageClientWrapper initialRecentJobs={initialRecentJobs} />;
}
