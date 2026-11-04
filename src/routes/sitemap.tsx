import { createFileRoute } from "@tanstack/react-router";
import Sitemap from "@/pages/Sitemap";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/sitemap")({
  head: () => routeHead("/sitemap"),
  component: Sitemap,
});
