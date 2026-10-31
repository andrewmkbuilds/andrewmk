import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { Parallax } from "@/components/ui/Parallax";
import logoUrl from "@/assets/andrewbuilds-logo.png";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/achievements", label: "Achievements" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

/**
 * The closing scene: layered light, a raised contact CTA and an oversized
 * watermark wordmark that fades toward the horizon. Nav, social and copyright
 * destinations are unchanged.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-border/70">
      {/* background — ambient light and a gold horizon line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Parallax
          distance={26}
          className="absolute -top-40 left-1/2 h-72 w-[110%]"
        >
          <div className="-translate-x-1/2 h-full w-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_100%)]" />
        </Parallax>
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
      </div>

      <div className="container relative py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,0.85fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="AndrewBuilds logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-md ring-1 ring-foreground/15 shadow-[var(--elev-1)]"
              />
              <p className="text-lg font-semibold text-foreground">
                Andrew Mathews
              </p>
            </div>
            <p className="mt-3 font-mono text-sm text-muted-foreground">
              Student · Developer · AI Builder
            </p>

            <div className="mt-7 inline-flex">
              <Link
                to="/contact"
                className="cta-pop group inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/10 px-5 py-3 font-mono text-sm text-foreground"
              >
                Let's build something
                <ArrowRight
                  className="cta-arrow h-4 w-4 text-gold"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Explore
            </p>
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="link-underline w-fit font-mono text-sm text-muted-foreground transition-colors hover:text-gold"
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
            <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
              Dubai, United Arab Emirates
              <br />
              Always building.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border/60 pt-6 font-mono text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            <span className="text-primary">//</span> Built by Andrew ·{" "}
            {currentYear}
          </p>
          <p className="text-muted-foreground/80">
            AI · Software · Robotics · Systems
          </p>
        </div>
      </div>

      {/* foreground watermark — decorative, fades into the depth field */}
      <div
        aria-hidden="true"
        className="container relative pointer-events-none select-none"
      >
        <p className="headline-3d -mb-[0.18em] bg-linear-to-b from-foreground/[0.10] to-transparent bg-clip-text text-[clamp(2.75rem,12.5vw,10rem)] font-semibold leading-[0.8] tracking-tight text-transparent">
          AndrewBuilds
        </p>
      </div>
    </footer>
  );
}
