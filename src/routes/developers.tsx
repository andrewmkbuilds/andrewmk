import { createFileRoute } from "@tanstack/react-router";
import Developers from "@/pages/Developers";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/developers")({
  head: () => routeHead("/developers"),
  component: Developers,
});
