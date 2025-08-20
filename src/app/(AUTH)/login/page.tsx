"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import LogoutButton from "@/components/LogoutButton";
import { ROLES } from "@/lib/roles";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Attempting login with:", { email, password });

    // ✅ use signIn from auth.ts
    const { user, session } = await signIn(email, password);

    if (!user || !session) {
      toast.error("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    // ✅ fetch user metadata from supabase
    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !currentUser) {
      console.error("Error fetching user:", userError?.message);
      toast.error("Failed to fetch user info.");
      setLoading(false);
      return;
    }

    console.log("User object:", currentUser);
    console.log("User metadata:", currentUser.user_metadata);

    const role = currentUser.user_metadata?.role;
    console.log("Role:", role);

    if (!role) {
      toast.error("No role found. Please contact support.");
      setLoading(false);
      return;
    }

    toast.success("Login successful! Redirecting...");

    // 🚀 Redirect based on role
    if (role === ROLES.SEEKER) router.push("/seeker/dashboard");
    else if (role === ROLES.EMPLOYER) router.push("/employer/dashboard");
    else if (role === ROLES.ADMIN) router.push("/admin/dashboard");
    else toast.error("Unknown role.");

    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded text-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded text-blue-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <LogoutButton />
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Forgot your password?{" "}
        <a href="/forgot-password" className="text-blue-600 underline">
          Reset it here
        </a>
      </p>
    </main>
  );
}
