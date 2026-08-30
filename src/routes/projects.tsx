import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/projects")({
  head: () => routeHead("/projects"),
  component: Projects,
});
