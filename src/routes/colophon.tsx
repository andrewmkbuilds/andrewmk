import { createFileRoute } from "@tanstack/react-router";
import Colophon from "@/pages/Colophon";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/colophon")({
  head: () => routeHead("/colophon"),
  component: Colophon,
});
