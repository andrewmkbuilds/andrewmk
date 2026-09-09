import { createFileRoute } from "@tanstack/react-router";
import AdminMedia from "@/pages/AdminMedia";

export const Route = createFileRoute("/_authenticated/admin/media")({
  head: () => ({
    meta: [
      { title: "Media library | Admin" },
      { name: "description", content: "Private admin media library for portfolio images." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMedia,
});
