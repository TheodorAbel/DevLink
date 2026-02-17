// src/middleware.ts
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/seeker/:path*", "/employer/:path*", "/admin/:path*"],
};

export async function middleware() {
  return NextResponse.next();
}
