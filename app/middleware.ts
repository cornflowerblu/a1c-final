// middleware.ts
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { userId, getToken, sessionClaims } = getAuth(request);

  console.log('HI IM MIDDLEWARE' + sessionClaims);

  if (!userId) {
    // Unauthenticated — redirect to sign-in or return 401
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Optional: fetch Bearer token if needed (e.g., for Supabase)
  const token = await getToken({ template: "supabase" });

  const res = NextResponse.next();
  res.headers.set("x-user-id", userId);
  res.headers.set("x-clerk-token", token as any); // 🟡 pass the token to use later
  return res;
}

export const config = {
  matcher: [
    "/api/user",
    // Add more paths here if needed
    "/((?!sign-in|sign-up|api/public).*)",
  ],
};
