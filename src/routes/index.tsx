import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/")({
  head: () => routeHead("/"),
  component: Home,
});
