import { createFileRoute } from "@tanstack/react-router";
import Faq from "@/pages/Faq";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/faq")({
  head: () => routeHead("/faq"),
  component: Faq,
});
