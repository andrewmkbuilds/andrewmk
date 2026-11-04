import { createFileRoute } from "@tanstack/react-router";
import PressKit from "@/pages/PressKit";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/press-kit")({
  head: () => routeHead("/press-kit"),
  component: PressKit,
});
