"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {ROLES} from "@/lib/roles"

// Extract access_token and type from both query and hash
function getAuthParams(): { access_token: string | null; type: string | null } {
  const queryParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));


  return {
    access_token:
      queryParams.get("access_token") || hashParams.get("access_token"),
    type: queryParams.get("type") || hashParams.get("type"),
  };
}

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"verifying" | "verified" | "error">(
    "verifying"
  );
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const { access_token, type } = getAuthParams();

      console.log("🔍 access_token:", access_token);
      console.log("🔍 type:", type);

      if (!access_token || type !== "signup") {
        console.warn("❌ Missing access_token or invalid type");
        setStatus("error");
        return;
      }

      // Try fetching user directly; if access_token present, pass it for reliability
      const { data: userData, error: userError } =
        await supabase.auth.getUser(access_token || undefined);
      const user = userData?.user;

      console.log("👤 Fetched user:", user);
      if (userError || !user) {
        console.warn("⚠️ No active session. Redirecting to login.");
        setStatus("error");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (!user.email_confirmed_at) {
        console.warn("❌ Email not confirmed yet:", user.email_confirmed_at);
        setStatus("error");
        return;
      }

      console.log("✅ Email confirmed at:", user.email_confirmed_at);

      // Fetch role from public.users; fallback to metadata role if missing
      const { data: publicUser, error: publicError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      console.log("🔍 public.users lookup:", publicUser, publicError);
      let dbRole = publicUser?.role as string | undefined;
      const metaRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();

      if (!dbRole) {
        // Attempt to upsert a minimal users row from metadata so subsequent guards work
        const fallbackRole = metaRole ?? ROLES.SEEKER;
        console.log("ℹ️ Upserting users row with fallback role:", fallbackRole);
        const { error: upsertErr } = await supabase
          .from("users")
          .upsert({ id: user.id, email: user.email, name: user.user_metadata?.name ?? "User", role: fallbackRole }, { onConflict: "id" });
        if (upsertErr) {
          console.error("❌ Upsert users failed:", upsertErr);
        } else {
          dbRole = fallbackRole;
        }
      }

      const effectiveRole = dbRole ?? metaRole ?? null;
      if (!effectiveRole) {
        console.warn("❌ Role missing or lookup failed");
        setStatus("error");
        return;
      }

      console.log("✅ Role resolved:", effectiveRole);
      setStatus("verified");

      setTimeout(() => {
        switch (effectiveRole) {
          case ROLES.SEEKER:
            router.push("/seeker");
            break;
          case ROLES.EMPLOYER:
            // Redirect to 3-step company profile signup
            router.push("/employer-signup");
            break;
          case ROLES.ADMIN:
            router.push("/admin/dashboard");
            break;
          default:
            router.push("/dashboard");
        }
      }, 2000);
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {status === "verifying" && (
        <p className="text-lg font-medium text-gray-600">
          Verifying your email...
        </p>
      )}
      {status === "verified" && (
        <p className="text-lg font-semibold text-green-600">
          ✅ Email verified! Redirecting...
        </p>
      )}
      {status === "error" && (
        <p className="text-lg font-semibold text-red-600">
          ❌ Verification failed. Please try logging in again.
        </p>
      )}
    </div>
  );
}
