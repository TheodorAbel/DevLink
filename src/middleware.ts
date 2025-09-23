// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { ROLES } from "@/lib/roles";

export const config = {
  matcher: ["/seeker/:path*", "/employer/:path*", "/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ✅ Edge-safe Supabase client (no Node-only APIs)
  const supabase = createMiddlewareClient({ req, res });

  // 1️⃣ Get user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const safePaths = [
    "/email-verification",
    "/seeker",
    "/employer/dashboard",
    "/admin/dashboard",
  ];

  // 2️⃣ Allow first-time redirect to dashboard or email verification even if session not ready
  if (!user && safePaths.includes(req.nextUrl.pathname)) {
    return res;
  }

  // 3️⃣ Redirect all other non-logged-in users
  if (!user || authError) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4️⃣ Fetch role + email_verified from public.users
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role, email_verified")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  const { role, email_verified } = profile;

  // 5️⃣ Redirect unverified users (except /email-verification)
  if (!email_verified && req.nextUrl.pathname !== "/email-verification") {
    return NextResponse.redirect(new URL("/email-verification", req.url));
  }

  // 6️⃣ Role-based access
  const path = req.nextUrl.pathname;

  if (path.startsWith("/seeker") && role !== ROLES.SEEKER) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  if (path.startsWith("/employer") && role !== ROLES.EMPLOYER) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  if (path.startsWith("/admin") && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  // ✅ All checks passed → allow request
  return res;
}
