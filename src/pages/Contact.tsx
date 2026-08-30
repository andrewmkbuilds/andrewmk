import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Github, Mail, AlertTriangle } from "lucide-react";
import { GITHUB_URL, socialLinks } from "@/data/portfolio";
import { getSocialIcon } from "@/components/ui/SocialIcons";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [validated, setValidated] = useState(false);

  const validate = (v: typeof values): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = "Please enter your name.";
    if (!v.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
      e.email = "Please enter a valid email address.";
    if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
    return e;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);
    setValidated(Object.keys(next).length === 0);
  };

  const update = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setValidated(false);
  };

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-[1.08] text-balance">
              Let's build something.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Have an idea, project, competition, or collaboration? Let's talk.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="font-mono text-xs">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    name="name"
                    value={values.name}
                    onChange={update("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="font-mono text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="font-mono text-xs">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={update("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="font-mono text-xs text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="font-mono text-xs">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={update("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    placeholder="What are you building?"
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="font-mono text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="font-mono">
                  Check message
                </Button>

                <div
                  aria-live="polite"
                  className="rounded-xl border border-border bg-card p-4 text-sm"
                >
                  <p className="flex items-start gap-2 text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      No email service is connected yet, so this form does not send messages. Use
                      GitHub below to reach me in the meantime.
                      {validated && (
                        <span className="mt-2 block text-foreground">
                          Your message is valid and ready to send once delivery is connected.
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </form>
            </Reveal>

            <Reveal delay={80}>
              <div className="space-y-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile (@andrewmkbuilds)"
                  className="flex items-center gap-4 rounded-xl border border-primary/40 bg-card p-5 shadow-card transition-colors hover:border-primary focus-ring"
                >
                  <Github className="h-5 w-5 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      GitHub <span className="font-mono text-[10px] uppercase tracking-wider text-primary">· Primary</span>
                    </span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      @andrewmkbuilds
                    </span>
                  </span>
                </a>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks
                    .filter((s) => s.id !== "github")
                    .map((link) => {
                      const Icon = getSocialIcon(link.id);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label} profile (${link.handle})`}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-colors hover:border-primary/40 focus-ring"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span>
                            <span className="block text-sm font-medium text-foreground">
                              {link.label}
                            </span>
                            <span className="block font-mono text-xs text-muted-foreground">
                              {link.handle}
                            </span>
                          </span>
                        </a>
                      );
                    })}
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-dashed border-border p-5">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Email</span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      Not configured yet
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
