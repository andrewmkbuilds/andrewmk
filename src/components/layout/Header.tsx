import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Code,
  FileText,
  FolderKanban,
  House,
  Info,
  Mail,
  Map,
  Menu,
  PenLine,
  PenTool,
  Quote,
  Route,
  Trophy,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { Magnetic } from "@/components/ui/Magnetic";
import logoUrl from "@/assets/andrewbuilds-logo.webp";

/**
 * Route match for the active pill. Derived from the router's resolved location
 * only (never `window`), so the server pass and the hydration pass agree.
 * `/projects` stays active on `/projects/gradr`, but `/projects-x` does not.
 */
function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop pill links — the shortest path through the site. */
const primaryNav = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/achievements", label: "Awards" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

/** Everything, for the mobile sheet — each route carries its own icon. */
const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: PenLine },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/resume", label: "Résumé", icon: FileText },
  { href: "/about", label: "About", icon: Info },
  { href: "/journey", label: "Journey", icon: Route },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/now", label: "Now", icon: Clock },
  { href: "/skills", label: "Skills", icon: Wrench },
  { href: "/press-kit", label: "Press kit", icon: Quote },
  { href: "/faq", label: "FAQ", icon: BookOpen },
  { href: "/colophon", label: "Colophon", icon: PenTool },
  { href: "/developers", label: "Developers", icon: Code },
  { href: "/sitemap", label: "Sitemap", icon: Map },
  { href: "/contact", label: "Contact", icon: Mail },
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

  const progressRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  // One shared, frame-batched scroll listener drives both the capsule's
  // elevation and its reading-progress edge. The progress bar is written
  // straight to the DOM, so scrolling never triggers a React render.
  useEffect(
    () =>
      subscribeScroll((y) => {
        const next = y > 16;
        if (next !== scrolledRef.current) {
          scrolledRef.current = next;
          setScrolled(next);
        }
        const el = progressRef.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        el.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : "0"})`;
      }),
    [],
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex justify-center px-3">
        <div
          className={cn(
            "relative mt-3 flex max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full p-1.5 transition-[box-shadow,background-color,border-color] duration-500 sm:mt-4",
            scrolled
              ? "glass shadow-[var(--elev-3)]"
              : "border border-foreground/10 bg-background/80",
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
            <span className="font-heading hidden text-[13.5px] font-semibold tracking-[0.01em] text-foreground min-[380px]:inline">
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
              const active = isActiveRoute(location.pathname, item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 font-mono text-[12.5px] transition-[color,background-color,transform] duration-300",
                    "hover:bg-foreground/[0.05] hover:text-gold hover:scale-[1.06] motion-reduce:hover:scale-100 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {active && (
                    <>
                      <span
                        className="absolute inset-0 -z-10 rounded-full border border-gold/25 bg-foreground/[0.06] shadow-[inset_0_1px_0_hsl(0_0%_100%/.1)]"
                        aria-hidden="true"
                      />
                      <span
                        className="nav-dot absolute top-1 right-1.5 h-1 w-1 rounded-full bg-gold"
                        aria-hidden="true"
                      />
                    </>
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-1 hidden items-center gap-1.5 lg:flex">
            <Magnetic strength={0.18} radius={60}>
              <Button
                asChild
                size="sm"
                className="group h-9 rounded-full px-4 font-mono text-[12.5px] shadow-glow transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Link to="/contact">
                  Let&rsquo;s talk
                  <ArrowUpRight
                    className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </Magnetic>
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
                {navItems.map((item, index) => {
                  const active = isActiveRoute(location.pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        to={item.href}
                        style={{ animationDelay: `${index * 45}ms` }}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group animate-fade-in-up flex items-center gap-3 rounded-lg px-3 py-3 font-mono text-lg opacity-0 transition-[color,background-color,transform] duration-300 hover:scale-[1.02] hover:bg-secondary hover:text-gold motion-reduce:hover:scale-100 focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:outline-none",
                          active
                            ? "bg-secondary/60 text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-transform duration-300 group-hover:-rotate-6",
                            active
                              ? "border-gold/35 bg-gold/10 text-gold"
                              : "border-border bg-background/60 text-muted-foreground group-hover:text-gold",
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
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
          <div
            ref={progressRef}
            aria-hidden="true"
            style={{ transform: "scaleX(0)" }}
            className="absolute inset-x-4 bottom-0 h-px origin-left rounded-full bg-linear-to-r from-primary via-gold to-transparent"
          />
        </div>
      </div>
    </header>
  );
}
