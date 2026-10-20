import { createMiddleware } from "@tanstack/react-start";

/**
 * Non-fatal replacement for the generated attachSupabaseAuth.
 * The generated attacher touches the Supabase client on EVERY server-function
 * call (including public ones like listing projects/blog posts), and the client
 * throws when backend env vars are absent (e.g. a GitHub → Cloudflare Pages
 * build without VITE_SUPABASE_*). Here the client is loaded lazily and any
 * failure simply means "no bearer token" — public calls keep working and
 * protected calls get a normal Unauthorized from requireSupabaseAuth.
 */
export const safeAttachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | undefined;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.auth.getSession();
      token = data.session?.access_token;
    } catch {
      token = undefined;
    }
    return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
  },
);
