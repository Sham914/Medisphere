// This file must only be imported in Next.js Server Components, Route Handlers, or Middleware.
// Do NOT import in client components or pages.
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function isServer() {
  // Next.js sets process.browser in client context, but in App Router use typeof window
  return typeof window === "undefined"
}

/**
 * Creates a Supabase client for server-side usage only.
 * Throws an error if used in client/page context.
 */
export async function createClient() {
  if (!isServer()) {
    throw new Error(
      "lib/supabase/server.ts: createClient() called in client/page context. Use lib/supabase/client.ts instead."
    )
  }
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}


