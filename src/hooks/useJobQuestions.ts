import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export type ScreeningType = 'yes-no' | 'multiple-choice' | 'checkbox' | 'short-answer';
export type ScreeningOption = { id: string; label: string; value: string };
export type ScreeningQuestion = {
  id: string;
  text: string;
  type: ScreeningType;
  options?: ScreeningOption[];
  required?: boolean;
};

export function useJobQuestions(jobId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['jobQuestions', jobId],
    enabled: enabled && !!jobId,
    queryFn: async (): Promise<ScreeningQuestion[]> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch(`/api/jobs/${jobId}/questions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) return [];
      const j = await res.json();
      const raw = (j?.questions || []) as Array<{
        id: string;
        question_text: string;
        question_type: string;
        options?: string[] | { id: string; label: string; value: string }[] | null;
        is_required?: boolean;
      }>;
      return raw.map((q, idx) => {
        let type: ScreeningType = 'short-answer';
        const qt = (q.question_type || '').toLowerCase();
        if (qt.includes('yes')) type = 'yes-no';
        else if (qt.includes('multiple')) type = 'multiple-choice';
        else if (qt.includes('checkbox')) type = 'checkbox';
        const optsRaw = q.options || [];
        interface RawOption { id?: string | number; label?: string; value?: string }
        const opts: ScreeningOption[] = Array.isArray(optsRaw)
          ? (optsRaw as (string | RawOption)[]).map((o: string | RawOption, i: number) => {
              if (typeof o === 'string') return { id: String(i), label: o, value: o };
              return { id: String(o.id ?? i), label: String(o.label ?? o.value ?? ''), value: String(o.value ?? o.label ?? '') };
            })
          : [];
        return { id: q.id ?? String(idx), text: q.question_text, type, options: opts, required: !!q.is_required };
      });
    },
    staleTime: 30_000,
  });
}
