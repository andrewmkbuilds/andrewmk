import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
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
