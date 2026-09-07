import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

import { getAdminStatus } from "@/lib/admin-contact.functions";

const NAV = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/settings", label: "Settings" },
] as const;

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Shared frame for the private content dashboard: nav, admin gate, page header. */
export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const fetchStatus = useServerFn(getAdminStatus);
  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });

  return (
    <main className="container py-14 md:py-20">
      <nav aria-label="Dashboard sections" className="flex flex-wrap gap-2">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="focus-ring rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground"
            activeOptions={{ exact: item.to === "/admin" }}
            activeProps={{ className: "border-gold/60 text-foreground" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-2xl text-foreground md:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions}
      </header>

      <div className="mt-8">
        {admin.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking your access…
          </p>
        ) : admin.data?.isAdmin ? (
          children
        ) : (
          <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground">
            This area is limited to the site owner.
          </p>
        )}
      </div>
    </main>
  );
}
