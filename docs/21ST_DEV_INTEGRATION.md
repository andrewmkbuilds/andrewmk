# 21st.dev component registry — what is and isn't reachable from here

Checked on 2026-10-31 against the live service. This note records the outcome so nobody re-runs
the same dead ends.

## The MCP route (previously attempted, still unavailable)

21st's editor integration is the **21st MCP** server (formerly "Magic"), distributed as
`@21st-dev/cli` / `@21st-dev/magic` and configured in an MCP-capable agent. This environment has
no MCP registry bridge and no MCP client configuration, so there is nothing to connect from the
sandbox: the tooling cannot be installed into the agent that runs here. That is a platform
capability gap, not a 21st.dev limitation.

## The supported alternative: the shadcn registry URL

21st.dev publishes every component as a standard **shadcn registry item**, which the plain
`shadcn` CLI can install without MCP:

```sh
npx shadcn@latest add "https://21st.dev/r/<author>/<component>?api_key=$API_KEY_21ST"
```

- Documented by 21st.dev itself: <https://21st.dev/blog/install-component-from-registry-url>
  and <https://21st.dev/mcp>.
- The URL must be **quoted** (an unquoted `&` splits the shell command) and the key must sit in
  double quotes so the variable expands.
- The CLI reads the item's files, npm dependencies and registry dependencies and writes them to
  the paths declared by `components.json` aliases (this repo: `@/components/ui`).

### It needs a credential, and that is the blocker here

Verified directly on 2026-10-31:

```
$ curl -s -o /dev/null -w '%{http_code}\n' https://21st.dev/r/kokonutd/bento-grid
403
{"error":"Authentication required","reason":"authentication_required", ...}
```

The endpoint returns `403 authentication_required` without a key, and the same 403 with an
invalid one. Per 21st.dev's docs the key comes from a **21st account with a membership**, and
installs are gated on it. The key is a user credential: it must never be committed, and no value
for it exists in this repository or in the sandbox secrets.

## What this repository does instead

| Option                                                   | Status here                                                                                                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React Bits registry (`@react-bits` in `components.json`) | **Wired and free** — components are vendored from `https://reactbits.dev/r/{name}.json` with no key. This is the working equivalent of what 21st.dev would provide. |
| shadcn/ui official registry                              | Wired (`components.json` aliases + `npx shadcn add`), used for the shadcn primitives already in `src/components/ui`.                                                |
| 21st.dev registry URL                                    | Available the moment `API_KEY_21ST` exists — run the command above from the repo root, review the diff, commit the files. Nothing in the code needs to change.      |
| Copying a component by hand                              | Always possible: the component page shows the source; adapt its tokens to this palette instead of installing it.                                                    |

To enable the 21st.dev registry later, export the key in the shell (never in a tracked file):

```sh
read -r -s API_KEY_21ST        # prompt, not stored
npx shadcn@latest add "https://21st.dev/r/<author>/<component>?api_key=$API_KEY_21ST"
unset API_KEY_21ST
```

Installed files land in `src/components/ui` and are ordinary source after that: review the diff,
rename colliding files, and restyle tokens to the navy/gold system before committing.

## What was actually applied (2026-11-01)

No 21st.dev component was installed — the URL route still needs an `API_KEY_21ST` that this
workspace does not have, and nothing here should pretend otherwise. The site was taken through
the same design pass by hand, using the patterns those components demonstrate: a floating pill
navigation, animated display type with an editorial serif voice, taped/tilted project cards with
a glare sheen, hover-lifting case media, and two-row logo ribbons. The React Bits components that
*did* install cleanly from their public registry are recorded in `AGENTS.md` ("React Bits and
21st.dev").
