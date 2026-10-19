import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin authentication server functions.
 *
 * The admin area is gated two ways:
 *  - Client-side route guard (_authenticated/route.tsx) for fast UX feedback.
 *  - Server-side requireSupabaseAuth + assertAdmin on every mutating RPC.
 *
 * This module adds the sign-in flow on top of that:
 *  - getAuthPageState  — public, tells the sign-in page whether the first
 *                       admin has been provisioned yet (controls signup UI).
 *  - getSignInState    — after sign-in, reports whether the current user is
 *                       an admin (read via the user's own RLS-scoped client).
 *  - claimAdmin        — secure first-claim: grants the admin role to the
 *                       signed-in user ONLY when no admin exists yet. This
 *                       recovers accounts created before the
 *                       bootstrap_first_admin trigger was installed.
 */

export interface AuthPageState {
  adminExists: boolean;
}

/** Public: has any admin been provisioned? Drives whether signup is offered. */
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
    return {
      isAdmin: !!role,
      email: claims?.email ?? null,
    };
  });

/** Secure first-claim: grant admin to the signed-in user iff no admin exists. */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Re-check atomically: only the first claimant may become admin.
    const { count, error: checkError } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (checkError) throw new Error("Could not verify admin state.");
    if ((count ?? 0) > 0) {
      throw new Error("An administrator already exists. Ask an admin to grant you access.");
    }

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insertError) {
      // Unique constraint race: another claimant just won.
      if (insertError.code === "23505") {
        throw new Error("An administrator already exists. Ask an admin to grant you access.");
      }
      throw new Error("Could not grant admin access.");
    }

    return { ok: true };
  });
