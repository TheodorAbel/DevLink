"use client";

import { useState } from "react";
import { sendPasswordReset } from "@/lib/auth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await sendPasswordReset(email);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reset link sent to your email.");
    }

    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded text-blue-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending reset link..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Remembered your password?{" "}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
      </p>
    </main>
  );
}
