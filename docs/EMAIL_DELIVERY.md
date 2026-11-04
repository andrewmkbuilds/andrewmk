# Contact form email delivery (Resend)

## Configuration

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

## Verified state — 2026-11-02

Checked from the `web` service against the live Resend API (key names only;
no secret values printed):

- `RESEND_API_KEY` is present and accepted: `GET https://api.resend.com/domains`
  answers **200**.
- `CONTACT_TO_EMAIL` is present.
- `CONTACT_FROM_EMAIL` is present but **empty**, so every attempt falls back to
  `Portfolio <onboarding@resend.dev>` — the testing-mode sender.
- One sending domain exists on the account, **`gradr.me` (region
  `ap-northeast-1`), status `pending`**. Resend requires three records:

  | record | name                | type    | value                                        | status      |
  | ------ | ------------------- | ------- | -------------------------------------------- | ----------- |
  | DKIM   | `resend._domainkey` | `TXT`   | `p=MIGfMA0GCSq…` (as shown in the dashboard) | **pending** |
  | SPF    | `send`              | `CNAME` | `send.forge.rmta.net`                        | verified    |
  | SPF    | `rsend`             | `CNAME` | `rsend-apne1.forge.rmta.net`                 | verified    |

- **Root cause of the pending domain: `gradr.me` currently fails DNSSEC
  validation**, so no validating resolver can read any of its records. Measured
  2026-11-02 from inside the sandbox: `node:dns` returns `SERVFAIL` for
  `gradr.me` (MX), `send.gradr.me`, `rsend.gradr.me` and
  `resend._domainkey.gradr.me`; Cloudflare's DoH endpoint answers `Status: 2`
  with `EDE(6): DNSSEC Bogus invalid SEP for gradr.me`, and Google's answers
  `DNSSEC validation failure`.

  The domain's DS record at the `.me` registry therefore does not match the
  zone's DNSKEY. Until that is fixed at the registrar / DNS host (publish the
  matching DS record, or disable DNSSEC if the zone genuinely has none), Resend
  cannot verify the domain, and the DKIM record cannot be seen even once it is
  published.

## What to do, in order

1. **Fix DNSSEC for `gradr.me`** at the registrar: re-publish the DS record that
   matches the zone's current DNSKEY (or turn DNSSEC off). Confirm with a public
   resolver that `gradr.me` answers `NOERROR` rather than `SERVFAIL`.
2. **Publish the DKIM record** `resend._domainkey.gradr.me` as the `TXT` value
   shown in Resend → Domains → `gradr.me`. The two SPF `CNAME`s are already
   verified.
3. Wait for the domain to read **Verified** in Resend.
4. Set `CONTACT_FROM_EMAIL` (e.g. `Portfolio <contact@gradr.me>`) in this app's
   secrets — it is empty today. This is the only configuration change the code
   needs; Resend then accepts mail to any recipient.
5. Remove `CONTACT_FALLBACK_EMAIL` if it was set; it only exists so a
   testing-mode account still notifies the account owner.
6. Send **one** message from `/contact` and confirm two things: the row in
   `contact_messages` (with `delivery_status = 'email'`), and the email arriving
   at `CONTACT_TO_EMAIL`.

If `CONTACT_TO_EMAIL` should keep receiving mail before a domain is verified,
the only alternative is to set it to the Resend account owner's address; that
deliverable is limited to that single inbox.
