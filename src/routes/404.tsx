import { createFileRoute } from "@tanstack/react-router";
import NotFound from "@/pages/NotFound";
import { routeHead } from "@/lib/route-head";

// Addressable /404 page so the not-found screen carries its own noindex head
// metadata (unknown URLs still render NotFound via __root's notFoundComponent).
export const Route = createFileRoute("/404")({
  head: () => routeHead("/404"),
  component: NotFound,
});
