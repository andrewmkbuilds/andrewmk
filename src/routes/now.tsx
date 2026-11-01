import { createFileRoute } from "@tanstack/react-router";
import Now from "@/pages/Now";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/now")({
  head: () => routeHead("/now"),
  component: Now,
});
