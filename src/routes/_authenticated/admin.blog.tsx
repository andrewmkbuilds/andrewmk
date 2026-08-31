import { createFileRoute } from "@tanstack/react-router";
import AdminBlog from "@/pages/AdminBlog";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  head: () => ({
    meta: [
      { title: "Blog editor | Admin" },
      { name: "description", content: "Private admin editor for portfolio blog posts." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBlog,
});
