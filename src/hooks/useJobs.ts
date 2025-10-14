import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Job } from "@/components/JobCard";
import { formatDistanceToNow } from "date-fns";

export type JobsFilters = {
  search?: string;
  type?: string; // 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote' | 'all'
};

type DbJobRow = {
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
  skills_required: string[] | null;
  published_at: string | null;
  company_id: string;
  companies?: { company_name: string | null } | Array<{ company_name: string | null }> | null;
};

async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      location,
      job_type,
      salary_type,
      salary_min,
      salary_max,
      salary_fixed,
      salary_currency,
      custom_salary_message,
      description,
      skills_required,
      published_at,
      company_id,
      companies:company_id ( company_name )
    `)
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message || "Failed to load jobs");
  const rows = (data || []) as DbJobRow[];

  const mapped: Job[] = rows.map((j) => {
    let salary = "Competitive";
    if (j.salary_type === "range" && j.salary_min && j.salary_max) {
      salary = `${j.salary_currency || "ETB"} ${j.salary_min} - ${j.salary_max}`;
    } else if (j.salary_type === "fixed" && j.salary_fixed) {
      salary = `${j.salary_currency || "ETB"} ${j.salary_fixed}`;
    } else if (j.custom_salary_message) {
      salary = j.custom_salary_message;
    }
    const typeMap: Record<string, string> = { full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship" };
    const postedDate = j.published_at ? `${formatDistanceToNow(new Date(j.published_at), { addSuffix: true })}` : "Recently";
    const companyName: string = Array.isArray(j.companies) ? (j.companies[0]?.company_name ?? "Company") : (j.companies?.company_name ?? "Company");
    return {
      id: j.id,
      title: j.title,
      company: companyName,
      companyId: j.company_id,
      location: j.location ?? "—",
      salary,
      type: typeMap[j.job_type ?? ""] || j.job_type || "Full-time",
      postedDate,
      description: j.description || "",
      skills: Array.isArray(j.skills_required) ? j.skills_required : [],
      featured: false,
    } as Job;
  });
  return mapped;
}

export function useJobs(filters: JobsFilters = {}) {
  // use filters in query key to handle search/sorting externally if needed later
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: fetchJobs,
  });
}
