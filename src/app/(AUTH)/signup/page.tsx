"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
import { ROLES, Role } from "@/lib/roles";
import toast from "react-hot-toast";

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
      "If an account exists for this email, check your inbox to verify."
    );
  } catch (err) {
    console.error("Unexpected signup exception:", err);
    toast.error("Signup could not complete. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-blue-700">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex gap-4">
          {Object.values(ROLES).map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
              />
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
      </p>
      <p className="mt-2 text-sm text-gray-600">
        After signing up, check your email to verify your account.{" "}
        <a href="/email-verification" className="text-blue-600 underline">
          Learn more
        </a>
      </p>
    </main>
  );
}
