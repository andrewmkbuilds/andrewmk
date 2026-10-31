import { createFileRoute } from "@tanstack/react-router";
import Skills from "@/pages/Skills";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/skills")({
  head: () => routeHead("/skills"),
  component: Skills,
});
