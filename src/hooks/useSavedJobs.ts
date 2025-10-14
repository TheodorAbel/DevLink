import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Job } from "@/components/JobCard";

async function fetchSavedJobs(): Promise<Job[]> {
  // Try to include token when available
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  const res = await fetch("/api/saved-jobs", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to load saved jobs");
  const j = await res.json();
  return (Array.isArray(j.jobs) ? j.jobs : []) as Job[];
}

export function useSavedJobsList() {
  return useQuery({
    queryKey: ["savedJobs"],
    queryFn: fetchSavedJobs,
  });
}

export function useSaveJobMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { jobId: string; remove?: boolean }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch("/api/saved-jobs", {
        method: args.remove ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ jobId: args.jobId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to update saved job");
      }
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["savedJobs"] });
    },
  });
}

// Local mock saved jobs helper
const LS_SAVED_MOCK = "savedMockJobs";
export function getMockSaved(): Job[] {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(LS_SAVED_MOCK) : null;
    if (!raw) return [];
    return JSON.parse(raw) as Job[];
  } catch {
    return [];
  }
}

export function setMockSaved(jobs: Job[]) {
  try {
    window.localStorage.setItem(LS_SAVED_MOCK, JSON.stringify(jobs));
  } catch {}
}

export function toggleMockSaved(allJobs: Job[], jobId: string) {
  const current = getMockSaved();
  const exists = current.some((j) => j.id === jobId);
  let next: Job[];
  if (exists) {
    next = current.filter((j) => j.id !== jobId);
  } else {
    const job = allJobs.find((j) => j.id === jobId);
    if (!job) return { next: current, saved: false } as const;
    next = [job, ...current.filter((j) => j.id !== jobId)];
  }
  setMockSaved(next);
  return { next, saved: !exists } as const;
}
