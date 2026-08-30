import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/about")({
  head: () => routeHead("/about"),
  component: About,
});
