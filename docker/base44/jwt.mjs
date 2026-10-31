// Mints a local-development JWT for the self-hosted Postgres/PostgREST/GoTrue
// stack. The role in the payload is what PostgREST switches to, so `anon`,
// `authenticated` and `service_role` behave like their hosted Supabase twins.
//
// Usage: JWT_SECRET=... bun docker/base44/jwt.mjs <role>
import { createHmac } from "node:crypto";

const secret = process.env["JWT_SECRET"];
const role = process.argv[2];

if (!secret || !role) {
  console.error("usage: JWT_SECRET=<secret> bun docker/base44/jwt.mjs <role>");
  process.exit(1);
}

const b64url = (value) => Buffer.from(value).toString("base64url");
const issuedAt = Math.floor(Date.now() / 1000);

const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
const payload = b64url(
  JSON.stringify({
    role,
    iss: "base44-local-dev",
    iat: issuedAt,
    exp: issuedAt + 60 * 60 * 24 * 365 * 10,
  }),
);
const signature = createHmac("sha256", secret)
  .update(`${header}.${payload}`)
  .digest("base64url");

process.stdout.write(`${header}.${payload}.${signature}`);
