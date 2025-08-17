"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Logout failed. Please try again.");
      setLoading(false);
    } else {
      toast.success("Logged out successfully.");
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 rounded text-white ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
