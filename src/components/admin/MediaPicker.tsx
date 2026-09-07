import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, Loader2, X } from "lucide-react";

import { listMedia, uploadMedia, type MediaAsset } from "@/lib/media.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Reads a File into a base64 string without the data-URL prefix. */
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}

interface MediaPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function MediaPicker({ id, label, value, onChange }: MediaPickerProps) {
  const fetchMedia = useServerFn(listMedia);
  const upload = useServerFn(uploadMedia);
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const media = useQuery<MediaAsset[]>({
    queryKey: ["admin-media"],
    queryFn: () => fetchMedia(),
    enabled: open,
  });

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
    onSuccess: (asset) => {
      onChange(asset.url);
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={id}
          value={value}
          placeholder="/api/public/media/… or https://…"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Library"}
          </Button>
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
            Upload
          </Button>
        </div>
      </div>

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

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2">
          <img src={value} alt="" className="h-14 w-20 rounded object-cover" />
          <button
            type="button"
            className="focus-ring ml-auto rounded p-1 text-muted-foreground hover:text-foreground"
            onClick={() => onChange("")}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {open ? (
        <div className="max-h-64 overflow-auto rounded-lg border border-border bg-card p-3">
          {media.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading images…</p>
          ) : (media.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
          ) : (
            <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
              {(media.data ?? []).map((asset) => (
                <li key={asset.id}>
                  <button
                    type="button"
                    className="focus-ring w-full overflow-hidden rounded-lg border border-border"
                    onClick={() => {
                      onChange(asset.url);
                      setOpen(false);
                    }}
                  >
                    <img src={asset.url} alt={asset.alt} className="h-20 w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
