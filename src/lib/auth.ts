import { supabase } from "./supabaseClient";

export async function signUp(email: string, password: string, role: string,name:string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name,role },
    },
  });

  if (error || !data.user) {
    return { error };
  }

  return { user: data.user };
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function sendPasswordReset(email: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });
}

export async function exchangeCodeForSession(code: string) {
  return supabase.auth.exchangeCodeForSession(code);
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword });
}
