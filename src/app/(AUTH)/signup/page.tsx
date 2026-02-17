"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { ROLES, Role } from "@/lib/roles";
import toast from "react-hot-toast";
import { User, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { SaaSInput } from "@/components/auth/SaaSInput";
import { RoleSelector, roleOptions } from "@/components/auth/RoleSelector";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>(ROLES.SEEKER);
  const [loading, setLoading] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const {error } = await signUp(email, password, role, name);

    if (error) {
      console.error("Supabase returned an error:", error);

      // ✅ If it’s a password error, show it explicitly
      if (
        error.message.toLowerCase().includes("password") ||
        error.name?.toLowerCase().includes("password")
      ) {
        toast.error(error.message);
        return; // don’t continue
      }

      // ❌ If it’s another error (like duplicate email),
      // still show the generic success toast below
    }

    // ✅ Always show generic message (prevents email enumeration)
    toast.success(
      "Account created! Check your email to verify your account."
    );
    
    // Store the role in localStorage so we can redirect after verification
    if (typeof window !== 'undefined') {
      localStorage.setItem('pending_role', role);
    }
  } catch (err) {
    console.error("Unexpected signup exception:", err);
    toast.error("Signup could not complete. Please try again.");
  } finally {
    setLoading(false);
  }
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
                    Create your DevLink account
                  </h1>
                  <p className="text-slate-400">
                    Join thousands of seekers and employers connecting on DevLink
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <SaaSInput
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={setName}
                    placeholder="John Doe"
                    icon={<User className="w-5 h-5" />}
                    required
                    delay={0.3}
                  />

                  <SaaSInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="john@example.com"
                    icon={<Mail className="w-5 h-5" />}
                    required
                    delay={0.35}
                  />

                  <SaaSInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Create a strong password"
                    icon={<Lock className="w-5 h-5" />}
                    required
                    delay={0.4}
                  />

                  <RoleSelector
                    value={role}
                    onChange={setRole}
                    roles={roleOptions}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign Up
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
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-indigo-400 font-medium hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Log in
                    </Link>
                  </p>
                  <p className="text-xs text-slate-500">
                    After signing up, check your email to verify your account.
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
