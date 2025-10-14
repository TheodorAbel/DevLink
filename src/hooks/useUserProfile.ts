import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return data?.user ?? null;
    },
    staleTime: 30_000,
  });
}

export function useUserBootstrap() {
  return useQuery({
    queryKey: ["user", "bootstrap"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await fetch("/api/user/bootstrap", { method: "POST", headers });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to bootstrap user");
      }
      return res.json();
    },
  });
}
