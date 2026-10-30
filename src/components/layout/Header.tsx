import { useEffect, useState } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { Menu } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/ui/SocialIcons";
import logoUrl from "@/assets/andrewbuilds-logo.png";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/profile", label: "Profile" },
  { href: "/resume", label: "Résumé" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

/**
 * Floating glass navigation.
 *
 * At rest it sits flush in the environment; once the page scrolls it settles
 * into a glass bar with a real elevation shadow (--elev-3), so navigation
 * reads as the closest object in the scene without ever covering content
 * (the bar keeps a constant 64px footprint).
 */
export function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container">
        <div
          className={cn(
            "relative mt-2 flex h-14 items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-500 md:px-4",
            scrolled
              ? "glass shadow-[var(--elev-3)]"
              : "border border-transparent bg-background/20 backdrop-blur-sm",
          )}
        >
          <Link
            to="/"
            aria-label="Andrew Mathews — home"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="relative inline-flex">
              <img
                src={logoUrl}
                alt=""
                width={32}
                height={32}
                className="relative h-8 w-8 rounded-md ring-1 ring-foreground/15 shadow-[var(--elev-1)]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md bg-linear-to-b from-foreground/15 to-transparent"
              />
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              Andrew<span className="text-primary">Builds</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 font-mono text-[13px] transition-colors duration-300 hover:text-gold",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 -z-10 rounded-full border border-primary/30 bg-primary/10 shadow-[inset_0_1px_0_hsl(0_0%_100%/.12),0_10px_22px_-14px_hsl(204_74%_52%/.9)]"
                      aria-hidden="true"
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <SocialIcons
              ids={["github", "x", "instagram"]}
              className="gap-1.5 [&_a]:h-8 [&_a]:w-8 [&_a]:border-transparent [&_a]:bg-transparent"
            />
            <Button
              asChild
              size="sm"
              className="font-mono shadow-glow transition-transform hover:scale-[1.03]"
            >
              <Link to="/projects">View My Work</Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-border bg-background"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_60%_at_100%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]"
              />
              <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Navigation
                </p>
                {navItems.map((item, index) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      to={item.href}
                      style={{ animationDelay: `${index * 45}ms` }}
                      className={cn(
                        "animate-fade-in-up opacity-0 rounded-lg px-3 py-3 font-mono text-lg transition-colors hover:bg-secondary hover:text-gold",
                        location.pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      <span className="mr-3 text-primary">→</span>
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    to="/projects"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
                  >
                    View My Work
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Reading progress — the bar's lit bottom edge */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute inset-x-3 bottom-0 h-px origin-left bg-linear-to-r from-primary via-primary-glow to-transparent"
          />
        </div>
      </div>
    </header>
  );
}
