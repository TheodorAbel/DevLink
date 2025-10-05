"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Role } from "@/lib/roles";

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
    const checkRoleOnce = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        router.push("/login");
        return;
      }

      // Resolve role via secure server endpoint to bypass RLS
      let effectiveRole: string | null = null;
      try {
        const accessToken = session?.access_token;
        const res = await fetch("/api/user/bootstrap", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const out = await res.json().catch(() => ({}));
        // eslint-disable-next-line no-console
        console.log("RoleGuard bootstrap response:", res.status, out);
        const metaRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();
        effectiveRole = (out?.role as string | undefined)?.toLowerCase() ?? metaRole ?? null;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("RoleGuard bootstrap call failed:", e);
        const metaRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();
        effectiveRole = metaRole ?? null;
      }

      if (!effectiveRole || effectiveRole !== allowedRole.toLowerCase()) {
        setAuthorized(false);
        setLoading(false);
        router.push("/403");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkRoleOnce();
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
