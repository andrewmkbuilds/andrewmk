import { createFileRoute } from "@tanstack/react-router";
import AdminOverview from "@/pages/AdminOverview";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard overview | Admin" },
      { name: "description", content: "Private overview of portfolio content." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminOverview,
});
