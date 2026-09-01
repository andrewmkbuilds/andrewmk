import { createFileRoute } from "@tanstack/react-router";
import Resume from "@/pages/Resume";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/resume")({
  head: () => routeHead("/resume"),
  component: Resume,
});
