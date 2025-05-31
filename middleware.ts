// middleware.ts
import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/public"
  ],
  
  async afterAuth(auth, req) {
    const url = new URL(req.url);
    console.log('Middleware running for path:', url.pathname);
    
    // If the route is public or the user is authenticated, proceed
    if (auth.isPublicRoute || auth.userId) {
      // For authenticated routes, add the Supabase token
      if (auth.userId && !auth.isPublicRoute) {
        console.log('Protected route detected:', url.pathname);
        
        try {
          // Get token for Supabase
          const token = await auth.getToken({ template: "supabase" });
          console.log('Got Supabase token for', url.pathname, ':', !!token);
          
          const res = NextResponse.next();
          res.headers.set("x-user-id", auth.userId);
          res.headers.set("x-clerk-token", token || "");
          return res;
        } catch (error) {
          console.error('Error getting token:', error);
          return NextResponse.next();
        }
      }
      
      return NextResponse.next();
    }
    
    // If the user isn't authenticated and the route isn't public, redirect to sign-in
    console.log('No user ID, redirecting to sign-in');
    const signInUrl = new URL("https://modest-kite-9.accounts.dev/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Match specific API routes
    "/api/user/:path*",
    "/api/test-supabase/:path*",
    
    // Match all paths except sign-in, sign-up, and public API routes
    "/((?!sign-in|sign-up|api/public|_next|favicon.ico).*)"
  ],
};

