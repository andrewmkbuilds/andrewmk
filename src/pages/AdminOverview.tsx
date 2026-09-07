import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import AdminShell from "@/components/admin/AdminShell";
import { listAllProjects, type CmsProject } from "@/lib/projects.functions";
import { listAllPosts, type BlogPost } from "@/lib/blog.functions";
import { listMedia, type MediaAsset } from "@/lib/media.functions";

function Stat({ label, value, to }: { label: string; value: string; to: string }) {
  return (
    <Link
      to={to}
      className="focus-ring pop-card block rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-gold/50"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-display text-2xl text-foreground">{value}</p>
    </Link>
  );
}

export default function AdminOverview() {
  const fetchProjects = useServerFn(listAllProjects);
  const fetchPosts = useServerFn(listAllPosts);
  const fetchMedia = useServerFn(listMedia);

  const projects = useQuery<CmsProject[]>({
    queryKey: ["admin-projects"],
    queryFn: () => fetchProjects(),
  });
  const posts = useQuery<BlogPost[]>({
    queryKey: ["admin-blog-posts"],
    queryFn: () => fetchPosts(),
  });
  const media = useQuery<MediaAsset[]>({ queryKey: ["admin-media"], queryFn: () => fetchMedia() });

  const p = projects.data ?? [];
  const b = posts.data ?? [];

  return (
    <AdminShell
      title="Content dashboard"
      description="Manage your projects, blog posts and images. Drafts stay private until you publish them."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Published projects"
          value={`${p.filter((x) => x.published && !x.archived).length}`}
          to="/admin/projects"
        />
        <Stat
          label="Project drafts"
          value={`${p.filter((x) => !x.published && !x.archived).length}`}
          to="/admin/projects"
        />
        <Stat label="Published posts" value={`${b.filter((x) => x.published).length}`} to="/admin/blog" />
        <Stat label="Images" value={`${(media.data ?? []).length}`} to="/admin/media" />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            Recently updated projects
          </h2>
          <ul className="mt-4 list-none space-y-3 p-0 text-sm">
            {[...p]
              .sort((a, z) => z.updated_at.localeCompare(a.updated_at))
              .slice(0, 5)
              .map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <span className="text-foreground">{item.name}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.archived ? "Archived" : item.published ? "Live" : "Draft"}
                  </span>
                </li>
              ))}
            {p.length === 0 ? <li className="text-muted-foreground">Nothing yet.</li> : null}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
            Recently updated posts
          </h2>
          <ul className="mt-4 list-none space-y-3 p-0 text-sm">
            {[...b]
              .sort((a, z) => z.updated_at.localeCompare(a.updated_at))
              .slice(0, 5)
              .map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <span className="text-foreground">{item.title}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.archived ? "Archived" : item.published ? "Live" : "Draft"}
                  </span>
                </li>
              ))}
            {b.length === 0 ? <li className="text-muted-foreground">Nothing yet.</li> : null}
          </ul>
        </div>
      </section>
    </AdminShell>
  );
}
