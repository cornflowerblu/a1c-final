/**
 * Database client module that integrates Clerk authentication with Supabase
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Standard Supabase client for unauthenticated requests
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

/**
 * Creates a Supabase client with Clerk authentication
 * @param clerkToken - JWT token from Clerk with 'supabase' template
 */
export function createClerkSupabaseClient(clerkToken: string | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          // Insert the Clerk token into headers if available
          const headers = new Headers(options?.headers);
          if (clerkToken) {
            headers.set("Authorization", `Bearer ${clerkToken}`);
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

/**
 * React hook for client components to use Supabase with Clerk auth
 */
export function useSupabase() {
  // Import inside the function to avoid server/client mismatch
  const { useAuth } = require("@clerk/nextjs");
  const { getToken } = useAuth();

  // Create client with Clerk authentication
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: async (url, options = {}) => {
          // Get token and add to headers
          const token = await getToken({ template: "supabase" });

          const headers = new Headers(options?.headers);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );

  return supabaseClient;
}
