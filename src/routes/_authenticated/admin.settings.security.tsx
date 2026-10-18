import { createFileRoute } from "@tanstack/react-router";
import AdminSecurity from "@/pages/AdminSecurity";

export const Route = createFileRoute("/_authenticated/admin/settings/security")({
  head: () => ({
    meta: [
      { title: "Security | Admin" },
      { name: "description", content: "Private security settings for the admin account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSecurity,
});
