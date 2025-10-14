"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Role } from "@/lib/roles";
import { useUserBootstrap } from "@/hooks/useUserProfile";

type RoleGuardProps = {
  allowedRole: Role;
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  // We only check once on initial mount to avoid UX flashes on tab switches

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const { data: sess } = await supabase.auth.getSession();
      const user = sess.session?.user ?? null;
      if (!user) {
        if (!cancelled) {
          setAuthorized(false);
          setLoading(false);
          router.push("/login");
        }
        return;
      }
      // Fallback to metadata until bootstrap hook resolves
      let effectiveRole = (user.user_metadata?.role as string | undefined)?.toLowerCase() ?? null;
      try {
        // Prefer secure server-derived role
        const res = await fetch("/api/user/bootstrap", {
          method: "POST",
          headers: { Authorization: `Bearer ${sess.session?.access_token}` },
        });
        const out = await res.json().catch(() => ({}));
        effectiveRole = (out?.role as string | undefined)?.toLowerCase() ?? effectiveRole;
      } catch {}

      if (!effectiveRole || effectiveRole !== allowedRole.toLowerCase()) {
        if (!cancelled) {
          setAuthorized(false);
          setLoading(false);
          router.push("/403");
        }
        return;
      }
      if (!cancelled) {
        setAuthorized(true);
        setLoading(false);
      }
    };
    run();
    return () => { cancelled = true };
  }, [allowedRole, router]);

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
