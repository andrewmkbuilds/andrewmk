import { useState } from "react";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RULES = [
  "At least 12 characters",
  "Mix of upper and lower case letters",
  "At least one number",
  "At least one symbol",
];

function meetsPolicy(pw: string) {
  return pw.length >= 12 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
}

/**
 * Password change for the signed-in admin.
 * Verifies the current password by re-authenticating before updating, and
 * invalidates other sessions by signing out everywhere after a successful change.
 */
export function PasswordChangeForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mismatch = confirm.length > 0 && next !== confirm;
  const weak = next.length > 0 && !meetsPolicy(next);
  const disabled = busy || !current || !next || !confirm || mismatch || weak;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (next !== confirm) {
      setBusy(false);
      setError("The new password and confirmation do not match.");
      return;
    }
    if (!meetsPolicy(next)) {
      setBusy(false);
      setError("The new password does not meet the strength requirements.");
      return;
    }

    // Verify the current password by re-authenticating before any change.
    const { data: user } = await supabase.auth.getUser();
    const email = user.user?.email;
    if (!email) {
      setBusy(false);
      setError("Could not confirm your account. Please sign in again.");
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (reauthError) {
      setBusy(false);
      setError("Your current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Password updated. Other sessions have been signed out.");
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="pw-current">Current password</Label>
        <Input
          id="pw-current"
          type="password"
          autoComplete="current-password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pw-new">New password</Label>
        <Input
          id="pw-new"
          type="password"
          autoComplete="new-password"
          required
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
        {weak ? (
          <p className="text-xs text-foreground">Use a stronger password (see the rules below).</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="pw-confirm">Confirm new password</Label>
        <Input
          id="pw-confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {mismatch ? <p className="text-xs text-foreground">Passwords do not match.</p> : null}
      </div>

      <ul className="list-none space-y-1 p-0 text-xs text-muted-foreground">
        {RULES.map((rule) => (
          <li key={rule} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            {rule}
          </li>
        ))}
      </ul>

      <Button type="submit" disabled={disabled} className="font-mono focus-ring">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {busy ? "Updating…" : "Change password"}
      </Button>

      <div aria-live="polite" role="status" className="text-sm">
        {message ? (
          <p className="rounded-xl border border-primary/40 bg-primary/5 p-3 text-foreground">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-foreground">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
