import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mfa, setMfa] = useState<{ factorId: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setBusy(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setNotice("Account created. Confirm your email if prompted, then sign in.");
      setMode("signin");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setBusy(false);
      setError(signInError.message);
      return;
    }

    // Optional second factor: only prompt when the account has a verified TOTP factor.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = (factors?.totp ?? []).find((f) => f.status === "verified");
      setBusy(false);
      if (factor) {
        setMfa({ factorId: factor.id });
        setNotice("Enter the 6-digit code from your authenticator app.");
        return;
      }
    } else {
      setBusy(false);
    }

    navigate({ to: "/admin/messages" });
  }

  async function onVerifyMfa(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mfa) return;
    setBusy(true);
    setError(null);

    const challenge = await supabase.auth.mfa.challenge({ factorId: mfa.factorId });
    if (challenge.error || !challenge.data) {
      setBusy(false);
      setError(challenge.error?.message ?? "Could not start the verification challenge.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfa.factorId,
      challengeId: challenge.data.id,
      code: mfaCode.trim(),
    });
    setBusy(false);
    if (verifyError) {
      setError(verifyError.message);
      return;
    }
    navigate({ to: "/admin/messages" });
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-24">
      <h1 className="font-display text-3xl font-semibold text-foreground">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Private area. Admin access is required to review contact submissions.
      </p>

      {mfa ? (
        <form onSubmit={onVerifyMfa} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="mfa-signin-code">Authentication code</Label>
            <Input
              id="mfa-signin-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="max-w-40 font-mono"
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full font-mono focus-ring">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Verifying…" : "Verify code"}
          </Button>
          <div aria-live="polite" role="status" className="text-sm">
            {notice ? (
              <p className="rounded-xl border border-primary/40 bg-primary/5 p-3 text-foreground">
                {notice}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-foreground">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      ) : (
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="auth-password">Password</Label>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={busy} className="w-full font-mono">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full font-mono"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Create the admin account" : "Back to sign in"}
        </Button>

        <div aria-live="polite" role="status" className="text-sm">
          {notice ? (
            <p className="rounded-xl border border-primary/40 bg-primary/5 p-3 text-foreground">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-foreground">
              {error}
            </p>
          ) : null}
        </div>
      </form>
      )}
    </main>
  );
}
