# Contact form email delivery (Resend)

## Current configuration (unchanged)

| Variable                 | Purpose                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| `RESEND_API_KEY`         | Resend API key. Without it no email is attempted at all.          |
| `CONTACT_TO_EMAIL`       | Inbox that should receive contact-form notifications.             |
| `CONTACT_FROM_EMAIL`     | Sender. Blank falls back to `Portfolio <onboarding@resend.dev>`.  |
| `CONTACT_FALLBACK_EMAIL` | Optional, testing-mode only: retried when Resend blocks the send. |

Code path: `src/lib/contact.server.ts` → `deliverEmail()`.

1. Every submission is validated and written to `contact_messages` first, so a
   message is never lost when email fails.
2. Email is attempted only when both `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are
   set.
3. If the send is rejected with Resend's testing-mode message
   (`only send testing emails`), the code retries `CONTACT_FALLBACK_EMAIL` when
   it is set and different from `CONTACT_TO_EMAIL`.

## Why the test message was not emailed

The Resend account is still in **testing mode**. In that mode Resend only
delivers to the address that owns the Resend account; every other recipient is
rejected with HTTP 403 "You can only send testing emails to your own email
address". `CONTACT_TO_EMAIL` points at a different inbox, so the notification was
rejected while the message itself was stored in Postgres.

One test message was sent from `/contact` on 2026-10-31 and stored; no further
test messages have been sent since, on purpose.

## Exactly what changes once the sending domain is verified

Nothing in the code has to change. The steps are:

1. In the Resend dashboard → **Domains**, add the domain and publish the SPF and
   DKIM DNS records it shows. Wait for the domain to read **Verified**.
2. Set `CONTACT_FROM_EMAIL` (e.g. `Portfolio <contact@your-verified-domain>`) in
   this app's secrets. This is the only required configuration change — Resend
   then accepts mail to any recipient.
3. Remove `CONTACT_FALLBACK_EMAIL` if it was set; it only exists so a
   testing-mode account still notifies the account owner.
4. Send one message from `/contact` and confirm two things: the row in
   `contact_messages`, and the email arriving at `CONTACT_TO_EMAIL`.

If `CONTACT_TO_EMAIL` should keep receiving mail before a domain exists, the only
alternative is to set it to the Resend account owner's address; that deliverable
is limited to that single inbox.
