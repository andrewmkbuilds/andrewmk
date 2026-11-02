import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Imported here rather than at module scope: this route module is part of
    // the eagerly-loaded route tree on every page, so a top-level import pulled
    // the whole Supabase client (~110 KB) into the shared entry chunk that the
    // homepage has to download before it can hydrate. Deferring it keeps that
    // weight on the admin routes that actually use it.
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    // Role-based access: only users with the `admin` role may enter the admin
    // area. RLS lets a signed-in user read their own `user_roles` row, so this
    // guard runs client-side alongside the server-side assertAdmin checks.
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) throw redirect({ to: "/" });

    return { user: data.user };
  },
  component: () => <Outlet />,
});
