import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, ImagePlus, Loader2, Trash2 } from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import { deleteMedia, listMedia, updateMedia, uploadMedia, type MediaAsset } from "@/lib/media.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}

export default function AdminMedia() {
  const fetchMedia = useServerFn(listMedia);
  const upload = useServerFn(uploadMedia);
  const update = useServerFn(updateMedia);
  const remove = useServerFn(deleteMedia);
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const media = useQuery<MediaAsset[]>({ queryKey: ["admin-media"], queryFn: () => fetchMedia() });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-media"] });

  const uploading = useMutation({
    mutationFn: async (file: File) =>
      upload({
        data: {
          filename: file.name,
          mimeType: file.type as never,
          base64: await toBase64(file),
          alt: "",
        },
      }),
    onSuccess: () => {
      setError(null);
      void invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const saveAlt = useMutation({
    mutationFn: (input: { id: string; alt: string }) => update({ data: input }),
    onSuccess: () => void invalidate(),
    onError: (e: Error) => setError(e.message),
  });

  const deleting = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => void invalidate(),
    onError: (e: Error) => setError(e.message),
  });

  return (
    <AdminShell
      title="Media"
      description="Upload images once and reuse them across projects and blog posts."
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading.isPending}
          onClick={() => fileInput.current?.click()}
        >
          {uploading.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
          )}
          Upload image
        </Button>
      }
    >
      <input
        ref={fileInput}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploading.mutate(file);
          e.target.value = "";
        }}
      />

      {error ? (
        <p className="mb-5 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {media.isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading images…
        </p>
      ) : (media.data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">No images yet. Upload your first one.</p>
      ) : (
        <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {(media.data ?? []).map((asset) => (
            <li
              key={asset.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
            >
              <img src={asset.url} alt={asset.alt} className="h-40 w-full object-cover" />
              <div className="space-y-3 p-4">
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {asset.filename}
                </p>
                <Input
                  defaultValue={asset.alt}
                  aria-label={`Description for ${asset.filename}`}
                  placeholder="Image description"
                  onBlur={(e) => {
                    if (e.target.value !== asset.alt) {
                      saveAlt.mutate({ id: asset.id, alt: e.target.value });
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void navigator.clipboard.writeText(asset.url)}
                  >
                    <Copy className="h-4 w-4" aria-hidden="true" /> Copy link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("Delete this image?")) deleting.mutate(asset.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
