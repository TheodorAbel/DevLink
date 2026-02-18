"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Copy, Wand2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { ROLES } from "@/lib/roles";
import { signIn } from "@/lib/auth";
import { SaaSInput } from "@/components/auth/SaaSInput";

const SEEKER_DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_SEEKER_EMAIL ?? "lenehod633@alibto.com";
const SEEKER_DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_SEEKER_PASSWORD ?? "090909";

const EMPLOYER_DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMPLOYER_EMAIL ?? "hotaviv151@alibto.com";
const EMPLOYER_DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_EMPLOYER_PASSWORD ?? "090909";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed. Please copy manually.");
    }
  };

  const fillTestCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success("Test credentials filled");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn(email, password);

    if (result?.error) {
      const message = result.error.message || "Login failed. Please try again.";
      toast.error(message);
      setLoading(false);
      return;
    }

    const { user, session } = result;

    if (!user || !session) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
      return;
    }

    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      toast.error("Failed to fetch user info.");
      setLoading(false);
      return;
    }

    const role = currentUser.user_metadata?.role;
    if (!role) {
      toast.error("No role found. Please contact support.");
      setLoading(false);
      return;
    }

    toast.success("Login successful! Redirecting...");

    if (role === ROLES.SEEKER) router.push("/seeker");
    else if (role === ROLES.EMPLOYER) {
      try {
        const res = await fetch("/api/user/bootstrap", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const out = await res.json().catch(() => ({}));
        const companyId = (out?.company_id as string | null | undefined) ?? null;
        if (!companyId) {
          router.push("/employer-signup");
        } else {
          router.push("/employer/dashboard");
        }
      } catch {
        router.push("/employer/dashboard");
      }
    }
    else if (role === ROLES.ADMIN) router.push("/admin/dashboard");
    else toast.error("Unknown role.");

    setLoading(false);
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-900/30" />
      </div>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="relative z-10 px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              DevLink
            </span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Dark Glassmorphism Card */}
            <div className="relative backdrop-blur-xl bg-slate-900/60 rounded-2xl shadow-2xl border border-indigo-500/30 p-8">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 blur-xl" />

              <div className="relative space-y-8">
                {/* Heading */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                    Welcome back
                  </h1>
                  <p className="text-slate-400">
                    Log in to your DevLink account
                  </p>
                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-slate-950/30 px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-200">Test accounts</div>
                    <div className="text-xs text-slate-400">Use these accounts to explore DevLink.</div>
                  </div>

                  <div className="mt-3 grid gap-3">
                    <div className="rounded-lg border border-indigo-500/15 bg-slate-900/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-slate-300">Seeker</div>
                          <div className="text-[11px] text-slate-500">Email</div>
                          <div className="text-sm font-medium text-slate-200 break-all">{SEEKER_DEMO_EMAIL}</div>
                          <div className="mt-2 text-[11px] text-slate-500">Password</div>
                          <div className="text-sm font-medium text-slate-200 break-all">{SEEKER_DEMO_PASSWORD}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => fillTestCredentials(SEEKER_DEMO_EMAIL, SEEKER_DEMO_PASSWORD)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/25 transition-colors"
                          >
                            <Wand2 className="h-4 w-4" />
                            Use
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(`${SEEKER_DEMO_EMAIL}\n${SEEKER_DEMO_PASSWORD}`, "Seeker credentials")}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-indigo-500/15 bg-slate-900/30 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold text-slate-300">Recruiter</div>
                          <div className="text-[11px] text-slate-500">Email</div>
                          <div className="text-sm font-medium text-slate-200 break-all">{EMPLOYER_DEMO_EMAIL}</div>
                          <div className="mt-2 text-[11px] text-slate-500">Password</div>
                          <div className="text-sm font-medium text-slate-200 break-all">{EMPLOYER_DEMO_PASSWORD}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => fillTestCredentials(EMPLOYER_DEMO_EMAIL, EMPLOYER_DEMO_PASSWORD)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/25 transition-colors"
                          >
                            <Wand2 className="h-4 w-4" />
                            Use
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(`${EMPLOYER_DEMO_EMAIL}\n${EMPLOYER_DEMO_PASSWORD}`, "Recruiter credentials")}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  <SaaSInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="john@example.com"
                    icon={<Mail className="w-5 h-5" />}
                    required
                    delay={0.3}
                  />

                  <SaaSInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    icon={<Lock className="w-5 h-5" />}
                    required
                    delay={0.35}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-400" />
                    <Link
                      href="/forgot-password"
                      className="text-indigo-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Links */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Your data is safe with DevLink</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-indigo-400 font-medium hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Signal */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Trusted by 10,000+ job seekers and companies
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:inline">•</span>
            <span>© 2025 DevLink. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
