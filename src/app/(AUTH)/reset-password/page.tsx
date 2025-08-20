"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ App Router version
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.slice(1)).get("access_token");

    if (accessToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: "" })
        .then(() => setConfirmed(true));
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ prevent default form reload
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (!error) {
      toast.success("Password reset successfully! Login now.");
      router.push("/login"); // ✅ works with App Router
    } else {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {confirmed ? (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded px-3 py-2 w-64"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Reset Password
          </button>
        </form>
      ) : (
        <p>Verifying reset link...</p>
      )}
    </div>
  );
}
