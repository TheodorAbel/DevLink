"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on auth pages
  const authRoutes = ["/signup", "/login", "/email-verification", "/employer-signup", "/forgot-password"];
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route));
  
  if (isAuthPage) {
    return null;
  }
  
  return <Header />;
}
