import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin authentication server functions.
 *
 * The admin area is gated two ways:
 *  - Client-side route guard (_authenticated/route.tsx) for fast UX feedback.
 *  - Server-side requireSupabaseAuth + assertAdmin on every mutating RPC.
 *
 * This module backs the sign-in page:
 *  - getAuthPageState — public, tells the sign-in page whether the first
 *                      admin has been provisioned yet (gates the signup UI).
 *  - getSignInState   — after sign-in, reports whether the current user is an
 *                      admin (read via the user's own RLS-scoped client) and
 *                      records a login audit event for admins.
 *
 * First-admin provisioning is handled entirely by the database
 * `bootstrap_first_admin` trigger on auth.users — the very first signup is
 * granted the admin role server-side. There is deliberately no client-facing
 * "claim admin" RPC: a browser must never be able to grant itself the admin
 * role. Once an admin exists, the `block_signup_after_admin` trigger closes
 * public registration automatically.
 */

export interface AuthPageState {
  adminExists: boolean;
}

/** Public: has any admin been provisioned? Drives whether first-admin signup is offered. */
export const getAuthPageState = createServerFn({ method: "POST" }).handler(
  async (): Promise<AuthPageState> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count, error } = await supabaseAdmin
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if (error) throw error;
      return { adminExists: (count ?? 0) > 0 };
    } catch {
      // Fail closed: if the service client is unavailable, assume an admin
      // exists so we never offer public signup by accident.
      return { adminExists: true };
    }
  },
);

export interface SignInState {
  isAdmin: boolean;
  email: string | null;
}

/** After sign-in: is this user an admin? Read via the user's own RLS client. */
export const getSignInState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SignInState> => {
    const supabase = context.supabase as never as { from: (t: string) => any };
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    const claims = context.claims as { email?: string } | undefined;
    const isAdmin = !!role;
    const email = claims?.email ?? null;

    // Record a login audit event for admins (fire-and-forget; never throws).
    if (isAdmin) {
      const { recordAudit } = await import("./admin-audit.server");
      void recordAudit({
        actorId: context.userId,
        actorEmail: email,
        action: "login",
        entity: "auth",
      });
    }

    return { isAdmin, email };
  });
