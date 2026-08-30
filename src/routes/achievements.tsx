import { createFileRoute } from "@tanstack/react-router";
import Achievements from "@/pages/Achievements";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/achievements")({
  head: () => routeHead("/achievements"),
  component: Achievements,
});
