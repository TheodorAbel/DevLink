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

      const { data: profile, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        // eslint-disable-next-line no-console
        console.error("RoleGuard users select error:", error);
      }
      // eslint-disable-next-line no-console
      console.log("RoleGuard DB role:", profile?.role, "allowed:", allowedRole);
      // eslint-disable-next-line no-console
      console.log("RoleGuard metadata role:", user.user_metadata?.role);

      let dbRole = (profile?.role as string | undefined)?.toLowerCase();
      const metaRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();

      // If no DB role or select failed, attempt to upsert from metadata (first login path)
      if (!dbRole) {
        const fallbackRole = metaRole ?? 'seeker';
        // eslint-disable-next-line no-console
        console.log('RoleGuard: resolving role via metadata and upsert:', fallbackRole);
        const { error: upsertErr } = await supabase
          .from('users')
          .upsert({ id: user.id, role: fallbackRole, email: user.email, name: user.user_metadata?.name ?? 'User' }, { onConflict: 'id' });
        if (upsertErr) {
          // eslint-disable-next-line no-console
          console.error('RoleGuard upsert error:', upsertErr);
        } else {
          dbRole = fallbackRole;
        }
      }

      const effectiveRole = (dbRole ?? metaRole ?? null) as string | null;
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
