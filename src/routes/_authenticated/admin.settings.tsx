import { createFileRoute } from "@tanstack/react-router";
import AdminSettings from "@/pages/AdminSettings";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Admin" },
      { name: "description", content: "Private admin settings for the portfolio dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSettings,
});
