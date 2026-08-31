import { Fragment } from "react";

/**
 * Minimal, dependency-free renderer for the light markdown subset used in
 * blog posts: ## / ### headings, - bullet lists, 1. ordered lists, paragraphs.
 */
export function Prose({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-8 text-lg font-semibold text-foreground md:text-xl">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-display mt-10 text-2xl text-foreground md:text-3xl">
              {block.slice(3)}
            </h2>
          );
        }

        const lines = block.split("\n");
        if (lines.every((l) => /^-\s+/.test(l))) {
          return (
            <ul key={i} className="list-none space-y-2.5 p-0">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span className="leading-relaxed">{l.replace(/^-\s+/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={i} className="list-none space-y-2.5 p-0">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-3 text-muted-foreground">
                  <span className="font-mono text-xs text-gold">{String(j + 1).padStart(2, "0")}</span>
                  <span className="leading-relaxed">{l.replace(/^\d+\.\s+/, "")}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="leading-relaxed text-muted-foreground">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {l}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
