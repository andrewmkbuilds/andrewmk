import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { submitContactMessage } from "@/lib/contact.functions";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "error"; message: string };

/**
 * Reusable contact form. Shares the same server function, validation and
 * honeypot as the standalone /contact page so messages are stored and
 * delivered identically wherever it appears.
 */
export function ContactForm({ sourcePath = "/contact" }: { sourcePath?: string }) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const mountedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const send = useServerFn(submitContactMessage);

  const validate = (v: typeof values): Errors => {
    const e: Errors = {};
    if (v.name.trim().length < 2) e.name = "Please enter your name.";
    if (!v.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
      e.email = "Please enter a valid email address.";
    if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
    return e;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const result = await send({
        data: {
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          company: honeypot.current?.value ?? "",
          elapsedMs: Date.now() - mountedAt.current,
          sourcePath,
        },
      });

      if (result.ok) {
        setStatus({ kind: "sent", message: result.message });
        setValues({ name: "", email: "", message: "" });
      } else {
        setStatus({ kind: "error", message: result.message });
      }
    } catch {
      setStatus({
        kind: "error",
        message: "Couldn't send right now. Please try again or reach me on GitHub.",
      });
    }
  };

  const update = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (status.kind !== "sending") setStatus({ kind: "idle" });
  };

  // Unique id suffix so the form can appear more than once on a page.
  const uid = sourcePath.replace(/[^a-z0-9]/gi, "-");

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor={`name-${uid}`} className="font-mono text-xs">
          Name
        </Label>
        <Input
          id={`name-${uid}`}
          name="name"
          value={values.name}
          onChange={update("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `name-${uid}-error` : undefined}
          placeholder="Your name"
        />
        {errors.name && (
          <p id={`name-${uid}-error`} className="font-mono text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`email-${uid}`} className="font-mono text-xs">
          Email
        </Label>
        <Input
          id={`email-${uid}`}
          name="email"
          type="email"
          value={values.email}
          onChange={update("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `email-${uid}-error` : undefined}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id={`email-${uid}-error`} className="font-mono text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`message-${uid}`} className="font-mono text-xs">
          Message
        </Label>
        <Textarea
          id={`message-${uid}`}
          name="message"
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `message-${uid}-error` : undefined}
          placeholder="What are you building?"
          rows={5}
        />
        {errors.message && (
          <p id={`message-${uid}-error`} className="font-mono text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from users, catches bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`company-${uid}`}>Company</label>
        <input
          id={`company-${uid}`}
          name="company"
          type="text"
          ref={honeypot}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="font-mono"
        disabled={status.kind === "sending"}
      >
        {status.kind === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>

      <div aria-live="polite" role="status" className="text-sm">
        {status.kind === "sent" && (
          <p className="flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/5 p-4 text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{status.message}</span>
          </p>
        )}
        {status.kind === "error" && (
          <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
            <span>{status.message}</span>
          </p>
        )}
      </div>
    </form>
  );
}
