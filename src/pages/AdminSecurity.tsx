import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import AdminShell from "@/components/admin/AdminShell";
import { MfaPanel } from "@/components/admin/MfaPanel";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { listAdminAuditLog, type AuditLogRow } from "@/lib/admin-contact.functions";
import { getAdminStatus } from "@/lib/admin-contact.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

function formatTime(value: string) {
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function actionLabel(action: string) {
  const map: Record<string, string> = {
    mark_handled: "Message handled",
    reopen: "Message reopened",
    export_csv: "Exported messages",
    login: "Signed in",
    login_failed: "Failed sign-in",
    password_changed: "Password changed",
    mfa_enabled: "2FA enabled",
    mfa_disabled: "2FA disabled",
  };
  return map[action] ?? action;
}

export default function AdminSecurity() {
  const fetchStatus = useServerFn(getAdminStatus);
  const fetchAudit = useServerFn(listAdminAuditLog);
  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });
  const audit = useQuery<AuditLogRow[]>({
    queryKey: ["admin-audit"],
    queryFn: () => fetchAudit({ data: { limit: 30 } }),
  });

  async function signOutEverywhere() {
    await supabase.auth.signOut({ scope: "global" });
    window.location.href = "/auth";
  }

  return (
    <AdminShell
      title="Security"
      description="Password, two-factor authentication and recent security activity for your account."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Password */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your current password to confirm the change. Other active sessions are signed out
            after a successful update.
          </p>
          <div className="mt-5">
            <PasswordChangeForm />
          </div>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Account
          </h2>
          <p className="mt-3 text-sm text-foreground">{admin.data?.email ?? "—"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {admin.data?.isAdmin ? "Site owner access" : "Standard account"}
          </p>
          <Button
            variant="outline"
            className="mt-5 font-mono"
            onClick={signOutEverywhere}
          >
            Sign out everywhere
          </Button>
        </section>

        {/* Two-factor */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <MfaPanel />
        </section>

        {/* Security activity */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Security activity
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Recent account and content events. Sensitive values are never shown.
          </p>
          {audit.isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : audit.data && audit.data.length > 0 ? (
            <ul className="mt-4 list-none divide-y divide-border p-0">
              {audit.data.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm text-foreground">{actionLabel(row.action)}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {row.entity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{row.actor_email ?? "system"}</p>
                    <time className="font-mono text-[11px] text-muted-foreground">
                      {formatTime(row.created_at)}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No security events recorded yet.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
