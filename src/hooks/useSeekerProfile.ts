import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { fetchProfileStepsStatus } from "@/lib/seekerProfile";

// Types align to schema.sql tables (minimal fields needed by UI)
export type SeekerProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  about: string | null;
  skills: string[] | null;
  updated_at?: string | null;
};

export type Experience = {
  id: string;
  user_id: string;
  title: string;
  company: string;
  start_date: string; // ISO
  end_date: string | null; // ISO or null for present
  description: string | null;
  location: string | null;
};

export type Education = {
  id: string;
  user_id: string;
  school: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

export type Resume = {
  id: string;
  user_id: string;
  file_url: string;
  is_primary: boolean;
  created_at?: string;
};

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

// Profile
export function useSeekerProfile() {
  return useQuery({
    queryKey: ["seekerProfile"],
    queryFn: async (): Promise<SeekerProfile | null> => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) return null;
      const { data, error } = await supabase
        .from("seeker_profiles")
        .select("id, user_id, full_name, headline, location, about, skills, updated_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as unknown as SeekerProfile | null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpsertSeekerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SeekerProfile>) => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const row = { ...payload, user_id: userId };
      const { error } = await supabase.from("seeker_profiles").upsert(row, { onConflict: "user_id" });
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerProfile"] });
    },
  });
}

// Experience
export function useSeekerExperience() {
  return useQuery({
    queryKey: ["seekerExperience"],
    queryFn: async (): Promise<Experience[]> => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) return [];
      const { data, error } = await supabase
        .from("seeker_experience")
        .select("id, user_id, title, company, start_date, end_date, description, location")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []) as Experience[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<Experience, "id" | "user_id">) => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase.from("seeker_experience").insert({ ...row, user_id: userId });
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerExperience"] });
    },
  });
}

export function useUpdateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<Experience> & { id: string }) => {
      const { error } = await supabase.from("seeker_experience").update(row).eq("id", row.id);
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerExperience"] });
    },
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seeker_experience").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerExperience"] });
    },
  });
}

// Education
export function useSeekerEducation() {
  return useQuery({
    queryKey: ["seekerEducation"],
    queryFn: async (): Promise<Education[]> => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) return [];
      const { data, error } = await supabase
        .from("seeker_education")
        .select("id, user_id, school, degree, field_of_study, start_date, end_date, description")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []) as Education[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<Education, "id" | "user_id">) => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase.from("seeker_education").insert({ ...row, user_id: userId });
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerEducation"] });
    },
  });
}

export function useUpdateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<Education> & { id: string }) => {
      const { error } = await supabase.from("seeker_education").update(row).eq("id", row.id);
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerEducation"] });
    },
  });
}

export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seeker_education").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seekerEducation"] });
    },
  });
}

// Resumes
export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: async (): Promise<Resume[]> => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) return [];
      const { data, error } = await supabase
        .from("resumes")
        .select("id, user_id, file_url, is_primary, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data || []) as Resume[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<Resume, "id" | "user_id" | "is_primary"> & { is_primary?: boolean }) => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase.from("resumes").insert({ ...row, user_id: userId, is_primary: !!row.is_primary });
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useSetPrimaryResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess.session?.user?.id;
      if (!userId) throw new Error("Not authenticated");
      // Unset existing primary then set this one
      const { error: e1 } = await supabase.from("resumes").update({ is_primary: false }).eq("user_id", userId);
      if (e1) throw new Error(e1.message);
      const { error: e2 } = await supabase.from("resumes").update({ is_primary: true }).eq("id", id).eq("user_id", userId);
      if (e2) throw new Error(e2.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useDeleteResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return true as const;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

// Derive profile step status with instant initialData from cached queries
export function useProfileStepsStatus() {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["profileStepsStatus"],
    queryFn: fetchProfileStepsStatus,
    staleTime: 1000 * 60 * 5,
    initialData: (() => {
      try {
        const profile = qc.getQueryData<SeekerProfile | null>(["seekerProfile"]) || null;
        const exp = qc.getQueryData<Experience[]>(["seekerExperience"]) || [];
        const edu = qc.getQueryData<Education[]>(["seekerEducation"]) || [];
        const resumes = qc.getQueryData<Resume[]>(["resumes"]) || [];
        if (!profile && exp.length === 0 && edu.length === 0 && resumes.length === 0) return undefined;
        const basic = !!(profile?.full_name || profile?.headline || profile?.location || profile?.about);
        const experience = (exp?.length || 0) > 0;
        const resume = (resumes?.some(r => r.is_primary) || resumes.length > 0);
        const contact = !!(profile && (profile.location || profile.about));
        return { basic, experience, resume, contact } as { basic: boolean; experience: boolean; resume: boolean; contact: boolean };
      } catch {
        return undefined;
      }
    })(),
    placeholderData: (prev) => prev,
  });
}
