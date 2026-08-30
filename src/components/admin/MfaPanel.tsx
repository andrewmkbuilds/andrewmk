import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Factor {
  id: string;
  status: string;
  friendly_name?: string;
}

/**
 * Optional two-factor (TOTP) enrollment for admins.
 * Sign-in enforces the second step automatically once a factor is verified.
 */
export function MfaPanel() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [enroll, setEnroll] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    setLoading(false);
    if (listError) {
      setError(listError.message);
      return;
    }
    setFactors((data?.totp ?? []) as Factor[]);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const verified = factors.filter((f) => f.status === "verified");

  async function startEnroll() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`,
    });
    setBusy(false);
    if (enrollError || !data) {
      setError(enrollError?.message ?? "Could not start enrollment.");
      return;
    }
    setEnroll({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirmEnroll(event: React.FormEvent) {
    event.preventDefault();
    if (!enroll) return;
    setBusy(true);
    setError(null);
    const challenge = await supabase.auth.mfa.challenge({ factorId: enroll.id });
    if (challenge.error || !challenge.data) {
      setBusy(false);
      setError(challenge.error?.message ?? "Could not start the challenge.");
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: enroll.id,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    setBusy(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    setEnroll(null);
    setCode("");
    setMessage("Two-factor authentication is now active on this account.");
    void refresh();
  }

  async function disable(factorId: string) {
    setBusy(true);
    setError(null);
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    if (unenrollError) {
      setError(unenrollError.message);
      return;
    }
    setMessage("Two-factor authentication removed.");
    void refresh();
  }

  return (
    <section
      aria-labelledby="mfa-heading"
      className="mt-12 rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2">
        {verified.length > 0 ? (
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        )}
        <h2 id="mfa-heading" className="font-display text-lg font-semibold text-foreground">
          Two-factor authentication
        </h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Optional. When enabled, admin sign-in asks for a 6-digit code from your authenticator app.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Checking status…</p>
      ) : verified.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-mono text-xs text-foreground">
            Enabled
          </span>
          {verified.map((factor) => (
            <Button
              key={factor.id}
              type="button"
              size="sm"
              variant="outline"
              className="font-mono focus-ring"
              disabled={busy}
              onClick={() => disable(factor.id)}
            >
              Turn off
            </Button>
          ))}
        </div>
      ) : enroll ? (
        <form onSubmit={confirmEnroll} className="mt-5 space-y-4">
          <img
            src={enroll.qr}
            alt="QR code to add this account to your authenticator app"
            className="h-44 w-44 rounded-xl bg-white p-2"
          />
          <p className="font-mono text-xs break-all text-muted-foreground">
            Manual key: {enroll.secret}
          </p>
          <div className="space-y-2">
            <Label htmlFor="mfa-code">6-digit code</Label>
            <Input
              id="mfa-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="max-w-40 font-mono"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={busy} className="font-mono focus-ring">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Verify and enable
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="font-mono focus-ring"
              onClick={() => setEnroll(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          className="mt-4 font-mono focus-ring"
          disabled={busy}
          onClick={startEnroll}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Enable two-factor
        </Button>
      )}

      <div aria-live="polite" className="mt-4 space-y-2 text-sm">
        {message ? <p className="text-foreground">{message}</p> : null}
        {error ? <p className="text-foreground">{error}</p> : null}
      </div>
    </section>
  );
}
