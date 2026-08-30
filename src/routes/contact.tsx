import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/contact")({
  head: () => routeHead("/contact"),
  component: Contact,
});
