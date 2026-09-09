import { createFileRoute } from "@tanstack/react-router";
import AdminProjects from "@/pages/AdminProjects";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  head: () => ({
    meta: [
      { title: "Projects editor | Admin" },
      { name: "description", content: "Private admin editor for portfolio projects." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProjects,
});
