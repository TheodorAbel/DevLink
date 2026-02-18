"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Role } from "@/lib/roles";

type RoleGuardProps = {
  allowedRole: Role;
  requireCompanyProfile?: boolean;
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRole, requireCompanyProfile = false, children }: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  // We only check once on initial mount to avoid UX flashes on tab switches

  useEffect(() => {
    let cancelled = false;

    const withTimeout = async <T,>(promise: Promise<T>, ms: number) => {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          setTimeout(() => reject(new Error("Timeout")), ms);
        }),
      ]);
    };

    const run = async () => {
      setLoading(true);
      try {
        const { data: sess } = await withTimeout(supabase.auth.getSession(), 8000);
        const session = sess.session ?? null;
        const user = session?.user ?? null;

        if (!user) {
          if (!cancelled) {
            setAuthorized(false);
            setLoading(false);
            router.push("/login");
          }
          return;
        }

        let effectiveRole = (user.user_metadata?.role as string | undefined)?.toLowerCase() ?? null;
        let companyId: string | null = (user.user_metadata?.company_id as string | undefined) ?? null;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const res = await fetch("/api/user/bootstrap", {
            method: "POST",
            headers: { Authorization: `Bearer ${session?.access_token}` },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          const out = await res.json().catch(() => ({}));
          effectiveRole = (out?.role as string | undefined)?.toLowerCase() ?? effectiveRole;
          companyId = (out?.company_id as string | null | undefined) ?? companyId;
        } catch {}

        if (!effectiveRole || effectiveRole !== allowedRole.toLowerCase()) {
          if (!cancelled) {
            setAuthorized(false);
            setLoading(false);
            router.push("/403");
          }
          return;
        }

        if (
          !cancelled &&
          requireCompanyProfile &&
          allowedRole.toLowerCase() === "employer" &&
          !companyId
        ) {
          setAuthorized(false);
          setLoading(false);
          router.push("/employer-signup");
          return;
        }

        if (!cancelled) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setAuthorized(false);
          setLoading(false);
          router.push("/login");
        }
      }
    };
    run();
    return () => { cancelled = true };
  }, [allowedRole, requireCompanyProfile, router]);

  if (loading) {
    return (
      <div className="w-full min-h-[30vh] flex items-center justify-center text-sm text-muted-foreground">
        Checking access...
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
