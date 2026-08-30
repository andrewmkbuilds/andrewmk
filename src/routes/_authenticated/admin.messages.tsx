import { createFileRoute } from "@tanstack/react-router";
import AdminMessages from "@/pages/AdminMessages";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({
    meta: [
      { title: "Contact submissions | Admin" },
      { name: "description", content: "Private admin view for contact form submissions." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMessages,
});
