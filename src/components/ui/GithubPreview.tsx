import { useCallback, useEffect, useState } from "react";
import { Star, GitFork, ExternalLink, RefreshCw, CloudOff } from "lucide-react";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

const GITHUB_USER = "andrewmkbuilds";

/** Height reserved for the body so the card never shifts between states. */
const BODY_MIN_HEIGHT = "min-h-[190px] sm:min-h-[168px]";

/**
 * Live preview of public GitHub repositories via the public, unauthenticated
 * GitHub REST API. Shows a skeleton while loading and a graceful fallback when
 * the API is unavailable or rate-limited — never fabricated data.
 */
export function GithubPreview() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=4`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: Repo[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setState("unavailable");
          return;
        }
        setRepos(data.slice(0, 4));
        setState("ready");
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setState("unavailable");
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
          Live from GitHub
        </h3>
        <a
          href={`https://github.com/${GITHUB_USER}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded font-mono text-[11px] text-muted-foreground transition-colors hover:text-primary focus-ring"
          aria-label="See all public repositories on GitHub (opens in a new tab)"
        >
          All repos <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>

      <div className={BODY_MIN_HEIGHT} aria-live="polite" aria-busy={state === "loading"}>
        {state === "loading" && (
          <>
            <span className="sr-only">Loading recent repositories…</span>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="h-[78px] animate-pulse rounded-lg border border-border/60 bg-muted/40 motion-reduce:animate-none"
                />
              ))}
            </ul>
          </>
        )}

        {state === "unavailable" && (
          <div className="mt-4 flex h-[164px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-background/30 px-4 text-center sm:h-[142px]">
            <CloudOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">
              Live repository data isn't available right now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-ring"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" /> Try again
              </button>
              <a
                href={`https://github.com/${GITHUB_USER}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] text-primary transition-colors hover:brightness-110 focus-ring"
              >
                Browse on GitHub <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {state === "ready" && repos && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {repos.map((repo) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${repo.name} repository on GitHub (opens in a new tab)`}
                  className="group block h-full rounded-lg border border-border/70 bg-background/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 focus-ring motion-reduce:hover:translate-y-0"
                >
                  <p className="font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                    {repo.name}
                  </p>
                  {repo.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" aria-hidden="true" /> {repo.stargazers_count}
                      <span className="sr-only">stars</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" aria-hidden="true" /> {repo.forks_count}
                      <span className="sr-only">forks</span>
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
