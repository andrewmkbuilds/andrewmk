import { createFileRoute } from "@tanstack/react-router";
import Websites from "@/pages/Websites";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/websites")({
  head: () => routeHead("/websites"),
  component: Websites,
});
