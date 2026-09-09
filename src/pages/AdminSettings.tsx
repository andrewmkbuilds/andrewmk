import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";

import AdminShell from "@/components/admin/AdminShell";
import { MfaPanel } from "@/components/admin/MfaPanel";
import { getAdminStatus } from "@/lib/admin-contact.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const fetchStatus = useServerFn(getAdminStatus);
  const navigate = useNavigate();
  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <AdminShell
      title="Settings"
      description="Your account, sign-in security and dashboard details."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Account
          </h2>
          <p className="mt-3 text-sm text-foreground">{admin.data?.email ?? "—"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {admin.data?.isAdmin ? "Site owner access" : "Standard account"}
          </p>
          <Button variant="outline" className="mt-5 font-mono" onClick={signOut}>
            Sign out
          </Button>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Two-step sign-in
          </h2>
          <div className="mt-4">
            <MfaPanel />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            How publishing works
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Drafts stay private — they never appear on the site, in menus or in search.</li>
            <li>Set a future publish date to schedule a post; it appears automatically.</li>
            <li>Archived items are hidden from the site but kept here for reference.</li>
            <li>Published pages are added to the site map the next time the site is built.</li>
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
