import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "Journey" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-md",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <span className="text-primary">/</span>Andrew
        </Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={location.pathname === item.href ? "page" : undefined}
              className={cn(
                "font-mono text-[13px] transition-colors hover:text-primary link-underline",
                location.pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm" className="font-mono transition-transform hover:scale-[1.03]">
            <Link to="/projects">View My Work</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="min-h-11 min-w-11" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm border-border bg-background">
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
                      "animate-fade-in-up opacity-0 rounded-lg px-3 py-3 font-mono text-lg transition-colors hover:bg-secondary hover:text-primary",
                      location.pathname === item.href ? "text-primary" : "text-muted-foreground",
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
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-mono text-sm text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  View My Work
                </Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
