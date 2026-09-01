import { createFileRoute } from "@tanstack/react-router";
import Profile from "@/pages/Profile";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/profile")({
  head: () => routeHead("/profile"),
  component: Profile,
});
