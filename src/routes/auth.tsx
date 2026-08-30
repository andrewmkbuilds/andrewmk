import { createFileRoute } from "@tanstack/react-router";
import Auth from "@/pages/Auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | Andrew Mathews" },
      { name: "description", content: "Private sign-in for the site admin area." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Auth,
});
