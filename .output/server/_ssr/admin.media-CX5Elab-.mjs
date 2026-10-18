import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, O as ImagePlus, V as Copy, c as Trash2 } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as AdminShell } from "./AdminShell-DtO3LkIS.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { i as uploadMedia, n as listMedia, r as updateMedia, t as deleteMedia } from "./media.functions-Bdg2vkfh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-CX5Elab-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that file."));
		reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
		reader.readAsDataURL(file);
	});
}
function AdminMedia() {
	const fetchMedia = useServerFn(listMedia);
	const upload = useServerFn(uploadMedia);
	const update = useServerFn(updateMedia);
	const remove = useServerFn(deleteMedia);
	const queryClient = useQueryClient();
	const fileInput = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const media = useQuery({
		queryKey: ["admin-media"],
		queryFn: () => fetchMedia()
	});
	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-media"] });
	const uploading = useMutation({
		mutationFn: async (file) => upload({ data: {
			filename: file.name,
			mimeType: file.type,
			base64: await toBase64(file),
			alt: ""
		} }),
		onSuccess: () => {
			setError(null);
			invalidate();
		},
		onError: (e) => setError(e.message)
	});
	const saveAlt = useMutation({
		mutationFn: (input) => update({ data: input }),
		onSuccess: () => void invalidate(),
		onError: (e) => setError(e.message)
	});
	const deleting = useMutation({
		mutationFn: (id) => remove({ data: { id } }),
		onSuccess: () => void invalidate(),
		onError: (e) => setError(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Media",
		description: "Upload images once and reuse them across projects and blog posts.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "outline",
			size: "sm",
			disabled: uploading.isPending,
			onClick: () => fileInput.current?.click(),
			children: [uploading.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
				className: "h-4 w-4 animate-spin",
				"aria-hidden": "true"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
				className: "h-4 w-4",
				"aria-hidden": "true"
			}), "Upload image"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileInput,
				type: "file",
				accept: "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
				className: "sr-only",
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) uploading.mutate(file);
					e.target.value = "";
				}
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-5 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-foreground",
				children: error
			}) : null,
			media.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "h-4 w-4 animate-spin",
					"aria-hidden": "true"
				}), " Loading images…"]
			}) : (media.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No images yet. Upload your first one."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3",
				children: (media.data ?? []).map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "overflow-hidden rounded-xl border border-border bg-card shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: asset.url,
						alt: asset.alt,
						className: "h-40 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-mono text-[11px] text-muted-foreground",
								children: asset.filename
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								defaultValue: asset.alt,
								"aria-label": `Description for ${asset.filename}`,
								placeholder: "Image description",
								onBlur: (e) => {
									if (e.target.value !== asset.alt) saveAlt.mutate({
										id: asset.id,
										alt: e.target.value
									});
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => void navigator.clipboard.writeText(asset.url),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), " Copy link"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: "text-destructive",
									onClick: () => {
										if (confirm("Delete this image?")) deleting.mutate(asset.id);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), " Delete"]
								})]
							})
						]
					})]
				}, asset.id))
			})
		]
	});
}
var SplitComponent = AdminMedia;
//#endregion
export { SplitComponent as component };
