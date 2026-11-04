import { Link, useLocation } from "@/lib/router-compat";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/ui/Parallax";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      {/* Unknown URLs must never become indexable duplicates. */}
      <meta name="robots" content="noindex, nofollow" />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
        {/* layered depth scene: ghost numeral behind, content in front */}
        <Parallax
          distance={48}
          ariaHidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="headline-3d select-none font-mono text-[38vw] leading-none text-foreground/[0.035]">
            404
          </span>
        </Parallax>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-gold/10 blur-[110px]"
        />
        <div className="container relative">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold">
            404
          </p>
          <h1 className="headline-3d text-display mt-4 text-[2.75rem] text-foreground md:text-[3.6rem] leading-[1.02]">
            This page isn't built yet.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            The route{" "}
            <span className="font-mono text-foreground">
              {location.pathname}
            </span>{" "}
            doesn't exist. Head back and explore the work instead.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="font-mono">
              <Link to="/">Back home</Link>
            </Button>
            <Button asChild variant="outline" className="font-mono">
              <Link to="/projects">View projects</Link>
            </Button>
          </div>
          <nav
            aria-label="Popular sections"
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
          >
            {[
              { to: "/about", label: "About" },
              { to: "/achievements", label: "Achievements" },
              { to: "/resume", label: "Résumé" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-gold focus-visible:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
