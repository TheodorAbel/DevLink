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

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile || profile.role !== allowedRole) {
        router.push("/403");
        return;
      }

      setAuthorized(true);
    };

    checkRole();
  }, [allowedRole, router]);

  if (!authorized) return null;

  return <>{children}</>;
}
