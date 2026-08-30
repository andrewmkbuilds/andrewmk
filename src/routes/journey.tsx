import { createFileRoute } from "@tanstack/react-router";
import Journey from "@/pages/Journey";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/journey")({
  head: () => routeHead("/journey"),
  component: Journey,
});
