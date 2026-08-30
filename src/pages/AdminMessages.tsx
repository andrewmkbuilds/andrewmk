import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Download, History, Loader2, RotateCcw, Search } from "lucide-react";

import {
  exportContactMessagesCsv,
  getAdminStatus,
  listAdminAuditLog,
  listContactMessages,
  setContactMessageHandled,
  type ContactMessageRow,
} from "@/lib/admin-contact.functions";
import { MfaPanel } from "@/components/admin/MfaPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StatusFilter = "all" | "open" | "handled";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "handled", label: "Handled" },
];

export default function AdminMessages() {
  const fetchStatus = useServerFn(getAdminStatus);
  const fetchMessages = useServerFn(listContactMessages);
  const markHandled = useServerFn(setContactMessageHandled);
  const exportCsv = useServerFn(exportContactMessagesCsv);
  const fetchAudit = useServerFn(listAdminAuditLog);
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("open");

  const admin = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });

  const messages = useQuery({
    queryKey: ["contact-messages", submittedSearch, status],
    enabled: admin.data?.isAdmin === true,
    queryFn: () => fetchMessages({ data: { search: submittedSearch, status, limit: 100 } }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string; handled: boolean }) => markHandled({ data: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit-log"] });
    },
  });

  const audit = useQuery({
    queryKey: ["admin-audit-log"],
    enabled: admin.data?.isAdmin === true,
    queryFn: () => fetchAudit({ data: { limit: 50 } }),
  });

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function downloadCsv() {
    setExporting(true);
    setExportError(null);
    try {
      const result = await exportCsv({ data: { search: submittedSearch, status, limit: 200 } });
      const blob = new Blob([`\uFEFF${result.csv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: ["admin-audit-log"] });
    } catch {
      setExportError("Could not export right now. Try again.");
    } finally {
      setExporting(false);
    }
  }

  const rows = useMemo<ContactMessageRow[]>(() => messages.data ?? [], [messages.data]);

  if (admin.isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-24">
        <p className="text-sm text-muted-foreground">Checking access…</p>
      </main>
    );
  }

  if (!admin.data?.isAdmin) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-24">
        <h1 className="font-display text-3xl font-semibold text-foreground">Admin</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This account does not have admin access to contact submissions.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-24">
      <header>
        <h1 className="font-display text-3xl font-semibold text-foreground">Contact submissions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search, review and mark messages as handled.
        </p>
      </header>

      <form
        className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedSearch(search.trim());
        }}
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="admin-search">Search name, email or message</Label>
          <Input
            id="admin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. website project"
          />
        </div>
        <Button type="submit" className="font-mono">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            type="button"
            variant={status === f.value ? "default" : "outline"}
            size="sm"
            aria-pressed={status === f.value}
            onClick={() => setStatus(f.value)}
            className="font-mono"
          >
            {f.label}
          </Button>
        ))}

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="ml-auto font-mono focus-ring"
          onClick={downloadCsv}
          disabled={exporting}
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          Export CSV
        </Button>
      </div>

      <p aria-live="polite" className="mt-2 text-xs text-muted-foreground">
        {exportError ?? "CSV exports respect the current search and status filter."}
      </p>

      <section aria-live="polite" className="mt-8 space-y-4">
        {messages.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading messages…</p>
        ) : messages.isError ? (
          <p className="text-sm text-foreground">Could not load messages. Try again.</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages match this view.</p>
        ) : (
          rows.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-border bg-card p-5 text-left"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {row.name}{" "}
                  <span className="font-sans text-sm font-normal text-muted-foreground">
                    {row.email}
                  </span>
                </h2>
                <p className="font-mono text-xs text-muted-foreground">
                  {new Date(row.created_at).toLocaleString()}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{row.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                  {row.delivery_status}
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                  spam {row.spam_score}
                </span>
                {row.handled_at ? (
                  <span className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-mono text-xs text-foreground">
                    <CheckCircle2 className="h-3 w-3 text-primary" aria-hidden="true" />
                    Handled
                  </span>
                ) : null}

                <Button
                  type="button"
                  size="sm"
                  variant={row.handled_at ? "outline" : "default"}
                  className="ml-auto font-mono"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate({ id: row.id, handled: !row.handled_at })}
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : row.handled_at ? (
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  {row.handled_at ? "Reopen" : "Mark handled"}
                </Button>
              </div>
            </article>
          ))
        )}
      </section>

      <section aria-labelledby="audit-heading" className="mt-14">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="audit-heading" className="font-display text-lg font-semibold text-foreground">
            Admin activity log
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Every admin change is recorded with a timestamp and the admin identity.
        </p>

        <ul className="mt-4 space-y-2">
          {audit.isLoading ? (
            <li className="text-sm text-muted-foreground">Loading activity…</li>
          ) : (audit.data ?? []).length === 0 ? (
            <li className="text-sm text-muted-foreground">No admin activity recorded yet.</li>
          ) : (
            (audit.data ?? []).map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="font-mono text-xs text-primary">{entry.action}</span>
                <span className="text-foreground">{entry.actor_email ?? "unknown admin"}</span>
                <span className="text-muted-foreground">{entry.entity}</span>
                <time
                  dateTime={entry.created_at}
                  className="ml-auto font-mono text-xs text-muted-foreground"
                >
                  {new Date(entry.created_at).toLocaleString()}
                </time>
              </li>
            ))
          )}
        </ul>
      </section>

      <MfaPanel />
    </main>
  );
}
