import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, LockKeyhole, LogOut } from "lucide-react";
import {
  getAuthPageState,
  getSignInState,
  claimAdmin,
} from "@/lib/admin-auth.functions";

type PostSignIn = "idle" | "can-claim" | "denied";

export default function Auth() {
  const navigate = useNavigate();
  const fetchAuthState = useServerFn(getAuthPageState);
  const fetchSignInState = useServerFn(getSignInState);
  const fetchClaimAdmin = useServerFn(claimAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [postSignIn, setPostSignIn] = useState<PostSignIn>("idle");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  // MFA
  const [mfa, setMfa] = useState<{ factorId: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  useEffect(() => {
    fetchAuthState()
      .then((s) => setAdminExists(s.adminExists))
      .catch(() => setAdminExists(true));
  }, [fetchAuthState]);

  const goToAdmin = useCallback(() => navigate({ to: "/admin/messages" }), [navigate]);

  async function resolveSignInState() {
    setBusy(true);
    setError(null);
    try {
      const state = await fetchSignInState();
      setSignedInEmail(state.email);
      if (state.isAdmin) {
        goToAdmin();
        return;
      }
      // Not an admin. If no admin has been provisioned yet, this signed-in
      // user may claim it (recovers accounts created before the bootstrap
      // trigger). Otherwise access is denied.
      setPostSignIn("can-claim");
      setBusy(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not verify your account.");
      setBusy(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    setPostSignIn("idle");

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
      setNotice("Admin account created. The bootstrap trigger grants the admin role on signup. Sign in to continue.");
      setMode("signin");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setBusy(false);
      setError(signInError.message);
      return;
    }

    // Optional second factor
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
    }

    await resolveSignInState();
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
    await resolveSignInState();
  }

  async function onClaimAdmin() {
    setBusy(true);
    setError(null);
    try {
      await fetchClaimAdmin();
      goToAdmin();
    } catch (e) {
      // If an admin already exists, this user can't claim — show denied.
      const msg = e instanceof Error ? e.message : "Could not grant admin access.";
      if (/already exists/i.test(msg)) {
        setPostSignIn("denied");
      } else {
        setError(msg);
      }
      setBusy(false);
    }
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    setPostSignIn("idle");
    setSignedInEmail(null);
    setPassword("");
    setMfa(null);
    setMfaCode("");
  }

  const showSignup = adminExists === false;

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center px-6 py-20">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/5">
          <LockKeyhole className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">
            Private area. Admin access is required to manage content and settings.
          </p>
        </div>
      </div>

      {mfa ? (
        <form onSubmit={onVerifyMfa} className="space-y-5">
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
          <StatusLine notice={notice} error={error} />
        </form>
      ) : postSignIn !== "idle" ? (
        <div className="space-y-5">
          {postSignIn === "can-claim" ? (
            <>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">
                    Signed in as {signedInEmail ?? "your account"}
                  </p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  No administrator has been set up on this site yet. You can claim admin access to
                  manage content, projects and settings.
                </p>
              </div>
              <Button
                type="button"
                disabled={busy}
                onClick={onClaimAdmin}
                className="w-full font-mono focus-ring"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {busy ? "Granting access…" : "Claim admin access"}
              </Button>
            </>
          ) : (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
              <p className="text-sm font-medium text-foreground">Access denied</p>
              <p className="mt-2 text-sm text-muted-foreground">
                An administrator already exists and your account doesn't have admin access. Ask an
                admin to grant you the role, or sign in with an admin account.
              </p>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="w-full font-mono"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
          <StatusLine notice={notice} error={error} />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              autoFocus
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

          <Button type="submit" disabled={busy} className="w-full font-mono focus-ring">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Working…" : mode === "signup" ? "Create admin account" : "Sign in"}
          </Button>

          {showSignup ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full font-mono"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create the first admin account" : "Back to sign in"}
            </Button>
          ) : null}

          <StatusLine notice={notice} error={error} />
        </form>
      )}
    </main>
  );
}

function StatusLine({ notice, error }: { notice: string | null; error: string | null }) {
  return (
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
  );
}
