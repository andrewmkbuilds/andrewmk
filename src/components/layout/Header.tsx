import { useEffect, useState } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { Menu, ArrowUpRight } from "lucide-react";
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

/** Desktop pill links — the shortest path through the site. */
const primaryNav = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/achievements", label: "Awards" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

/** Everything, for the mobile sheet. */
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
 * Floating pill navigation.
 *
 * A single glass capsule floats at the top of the page: avatar + wordmark,
 * the core routes, and one primary action. It sits flush in the environment
 * at rest and settles onto a real elevation shadow (--elev-3) once the page
 * scrolls, so it reads as the closest object in the scene.
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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex justify-center px-3">
        <div
          className={cn(
            "relative mt-3 flex items-center gap-1 rounded-full p-1.5 transition-all duration-500 sm:mt-4",
            scrolled
              ? "glass shadow-[var(--elev-3)]"
              : "border border-foreground/10 bg-background/45 backdrop-blur-md",
          )}
        >
          {/* Brand — avatar disc + wordmark */}
          <Link
            to="/"
            aria-label="Andrew Mathews — home"
            className="group flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-opacity hover:opacity-90"
          >
            <span className="relative inline-flex">
              <img
                src={logoUrl}
                alt=""
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded-full object-cover ring-1 ring-gold/35 shadow-[var(--elev-1)] transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span className="font-mono text-[13px] font-semibold tracking-tight text-foreground">
              Andrew<span className="text-primary">Builds</span>
            </span>
          </Link>

          <span
            aria-hidden="true"
            className="mx-1 hidden h-4 w-px bg-foreground/12 lg:block"
          />

          <nav
            aria-label="Main"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {primaryNav.map((item) => {
              const active = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 font-mono text-[12.5px] transition-colors duration-300 hover:text-gold",
                    active ? "text-foreground" : "text-muted-foreground",
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
                      className="absolute inset-0 -z-10 rounded-full border border-gold/25 bg-foreground/[0.06] shadow-[inset_0_1px_0_hsl(0_0%_100%/.1)]"
                      aria-hidden="true"
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-1 hidden items-center gap-1.5 lg:flex">
            <Button
              asChild
              size="sm"
              className="group h-9 rounded-full px-4 font-mono text-[12.5px] shadow-glow transition-transform hover:scale-[1.03]"
            >
              <Link to="/contact">
                Let&rsquo;s talk
                <ArrowUpRight
                  className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          {/* Mobile / tablet trigger stays inside the pill */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="ml-0.5 h-9 w-9 rounded-full"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[86vw] max-w-sm border-border bg-background"
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
                        "animate-fade-in-up rounded-lg px-3 py-3 font-mono text-lg opacity-0 transition-colors hover:bg-secondary hover:text-gold",
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
                    to="/contact"
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
                  >
                    Get in touch
                  </Link>
                </SheetClose>
                <div className="mt-6 border-t border-border pt-5">
                  <SocialIcons ids={["github", "x", "instagram"]} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Reading progress — the capsule's lit bottom edge */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute inset-x-4 bottom-0 h-px origin-left rounded-full bg-linear-to-r from-primary via-gold to-transparent"
          />
        </div>
      </div>
    </header>
  );
}
