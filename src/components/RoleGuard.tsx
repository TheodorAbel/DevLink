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

      if (error || !profile || profile.role !== allowedRole) {
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
