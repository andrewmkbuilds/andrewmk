import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex min-h-[70vh] items-center py-20">
        <div className="container">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">404</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-foreground">
            This page isn't built yet.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            The route <span className="font-mono text-foreground">{location.pathname}</span> doesn't
            exist. Head back and explore the work instead.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="font-mono">
              <Link to="/">Back home</Link>
            </Button>
            <Button asChild variant="outline" className="font-mono">
              <Link to="/projects">View projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
