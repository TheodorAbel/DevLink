import { supabase } from "./supabaseClient";
import { getOrigin } from "./utils";

export async function signUp(
  email: string,
  password: string,
  role: string,
  name: string
) {
  const origin = getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${origin}/email-verification`,
    },
  });

  if (error || !data.user) {
    return { error };
  }
  return { user: data.user };
}


export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session) {
    // Debug: surface the exact Supabase error in the console for troubleshooting
    console.error('signIn error:', error);
    return { error };
  }
  return { user: data.user, session: data.session };
}


export async function signOut() {
  return supabase.auth.signOut();
}

export async function sendPasswordReset(email: string) {
  const origin = getOrigin();
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
