import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) {
      return NextResponse.json({ error: "Missing Authorization bearer token" }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = userRes.user;

    // Read users row via service role to bypass RLS
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id, email, name, role, company_id")
      .eq("id", user.id)
      .maybeSingle();

    let role = existing?.role as string | undefined;
    const company_id = existing?.company_id as string | undefined;

    if (!existing) {
      // Upsert minimal users row using service role
      const fallbackRole = (user.user_metadata?.role as string | undefined)?.toLowerCase() || "seeker";
      const { error: upsertErr } = await supabaseAdmin
        .from("users")
        .upsert(
          {
            id: user.id,
            email: user.email,
            name: (user.user_metadata as Record<string, unknown> | undefined)?.name as string ?? "User",
            role: fallbackRole,
          },
          { onConflict: "id" }
        );
      if (upsertErr) {
        return NextResponse.json({ error: "Upsert users failed", details: upsertErr.message }, { status: 400 });
      }
      role = fallbackRole;
    }

    return NextResponse.json({ ok: true, role: role || null, company_id: company_id || null });
  } catch (e: unknown) {
    console.error("[API] /api/user/bootstrap error:", e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Unexpected error", details: message }, { status: 500 });
  }
}
