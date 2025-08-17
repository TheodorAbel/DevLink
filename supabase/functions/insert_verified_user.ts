import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { type, data } = await req.json();

  if (type === "user.updated" && data.email_confirmed_at) {
    const { id, email, user_metadata } = data;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingUser) {
      await supabase.from("users").insert({
        id,
        email,
        role: user_metadata?.role || "seeker",
      });
    }
  }

  return new Response("OK", { status: 200 });
});
