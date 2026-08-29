import { useEffect, useState } from "react";
import { Star, GitFork, ExternalLink } from "lucide-react";

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

/**
 * Live preview of public GitHub repositories via the public, unauthenticated
 * GitHub REST API. Renders nothing on failure/rate-limit — no fabricated data.
 */
export function GithubPreview() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const controller = new AbortController();
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
  }, []);

  if (state === "unavailable") return null;

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
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          aria-label="See all public repositories on GitHub"
        >
          All repos <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {state === "loading" && (
        <ul className="mt-4 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-12 animate-pulse rounded-lg bg-muted/50" />
          ))}
        </ul>
      )}

      {state === "ready" && repos && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-lg border border-border/70 bg-background/40 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hover:translate-y-0"
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
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {repo.forks_count}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
