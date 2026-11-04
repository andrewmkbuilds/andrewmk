# 21st.dev component registry — what is and isn't reachable from here

Checked on 2026-11-01 against the live service. This note records the outcome so nobody re-runs
the same dead ends.

## Short version

| Route                                                | Status here                                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **21st CLI** (`@21st-dev/cli`, `bunx @21st-dev/cli`) | **Installs and runs.** Search/install requires a sign-in or `API_KEY_21ST` — that key is the only blocker. |
| **shadcn registry URL** (`https://21st.dev/r/…`)     | Works with the same key; `403 authentication_required` without it (verified).                              |
| **21st MCP**                                         | Not available: this agent has no MCP bridge. The CLI is the supported non-MCP equivalent — same endpoint.  |
| **React Bits registry** (`@react-bits`)              | Free, no key, already wired in `components.json`. This is what the site actually vendors from.             |
| **Copy a component by hand**                         | Always possible; restyle to the navy/gold tokens instead of installing.                                    |

## The MCP route

21st's editor integration is the **21st MCP** server (formerly "Magic"). This environment has no
MCP registry bridge and no MCP client configuration, so there is nothing to connect from the
sandbox. That is a platform capability gap, not a 21st.dev limitation — and 21st ships a
first-class alternative, below.

## The supported alternative: the 21st CLI

`@21st-dev/cli` (binary `21st`) is the single command-line tool for everything 21st and
**shares one endpoint and one login with the MCP**, so a command returns exactly what an MCP
client would see (<https://21st.mintlify.app/cli>). It supersedes the older
`@21st-dev/registry` and `@21st-dev/magic` packages.

Verified in this sandbox on 2026-11-01 (the container has `bun`, not `npx`):

```sh
docker compose -f docker-compose.base44.yml exec -T web \
  bunx --bun @21st-dev/cli@latest search "pricing table"
# → Resolving dependencies / Resolved, downloaded and extracted [4]
# → Not signed in. Run `21st login` or set TWENTYFIRST_TOKEN.
```

So the package installs and runs here; **only the credential is missing**. The CLI resolves
credentials in this order: `--token`/`--api-key` flag → `TWENTYFIRST_TOKEN` → `API_KEY_21ST` →
a stored `21st login` session. A browser `21st login` is not possible in a headless sandbox, so
the env-var/API-key path is the one that works here (key from
<https://21st.dev/settings/api-keys>).

Once a key exists:

```sh
export API_KEY_21ST=<from the dashboard>          # never committed
docker compose -f docker-compose.base44.yml exec -T web \
  bunx --bun @21st-dev/cli@latest search "pricing table"
docker compose -f docker-compose.base44.yml exec -T web \
  bunx --bun @21st-dev/cli@latest add @scope/component
```

Installed files are ordinary source after that: review the diff, rename collisions, and restyle
tokens to this palette before committing.

## The shadcn registry URL (same credential)

Every 21st.md component is also a standard **shadcn registry item**, installable without the CLI:

```sh
npx shadcn@latest add "https://21st.dev/r/<author>/<component>?api_key=$API_KEY_21ST"
```

- Documented by 21st.dev: <https://21st.dev/blog/install-component-from-registry-url>.
- The URL must be **quoted** (an unquoted `&` splits the shell command).
- Verified 2026-10-31: `curl https://21st.dev/r/kokonutd/bento-grid` → `403
{"error":"Authentication required"}`; the same 403 with an invalid key. The key comes from a
  21st account with a membership, and it is a user credential — it must never be committed.

## What this repository does instead

- **React Bits** (`@react-bits` in `components.json`): free registry, vendored into
  `src/components/reactbits/` — `GlareHover.tsx` is the one still in use.
- **shadcn/ui**: the primitives in `src/components/ui` come from the official registry.
- The 21st.dev-style patterns (floating pill nav, editorial display type, taped/tilted cards with
  a glare sheen, hover-lifting case media, two-row logo ribbons) were implemented by hand in this
  codebase, so nothing depends on a component library we cannot re-fetch.

## What was actually applied (2026-11-01)

One component is integrated this way (`ui/portfolio-gallery.tsx`, the home "Ecosystem" archive;
the integration rules live in `docs/21ST_DEV_PROTOCOL.md`). The credential now exists:
`API_KEY_21ST` is declared
in `.base44/environment.json` and delivered to the `web` service through
`env_file: /run/base44/app.env`, so it needs no manual export in the container. Verified inside the
container after it landed:

```sh
docker compose -f docker-compose.base44.yml exec -T web \
  bunx --bun @21st-dev/cli@latest search "pricing table"
# → 1. [component] Pricing table — dgearsonu1 [id: 8374] … 4 result(s).
```

Search returns real results instead of the "Not signed in" message, and `search` takes no flag
change: `bunx --bun @21st-dev/cli@latest add <author>/<component>` installs into the bind-mounted
repo. The key is a user credential — it stays in the platform secret store, never in a file that
git tracks, and never in a command echoed into a transcript.
