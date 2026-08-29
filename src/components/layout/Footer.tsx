import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { GITHUB_URL } from "@/data/portfolio";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">Andrew Mathews</p>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              Student · Developer · AI Builder
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Find me online
            </p>
            <SocialIcons />
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 font-mono text-xs text-muted-foreground">
          <span className="text-primary">//</span> Built by Andrew · {currentYear}
        </p>
      </div>
    </footer>
  );
}
