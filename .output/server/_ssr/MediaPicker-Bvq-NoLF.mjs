import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BJUrh-0e.mjs";
import { E as LoaderCircle, O as ImagePlus, r as X } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Input } from "./input-Dnc48w6m.mjs";
import { t as Label } from "./label-BbEAm7Er.mjs";
import { i as uploadMedia, n as listMedia } from "./media.functions-Bdg2vkfh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MediaPicker-Bvq-NoLF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Reads a File into a base64 string without the data-URL prefix. */
function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that file."));
		reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
		reader.readAsDataURL(file);
	});
}
function MediaPicker({ id, label, value, onChange }) {
	const fetchMedia = useServerFn(listMedia);
	const upload = useServerFn(uploadMedia);
	const queryClient = useQueryClient();
	const fileInput = (0, import_react.useRef)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const media = useQuery({
		queryKey: ["admin-media"],
		queryFn: () => fetchMedia(),
		enabled: open
	});
	const uploading = useMutation({
		mutationFn: async (file) => upload({ data: {
			filename: file.name,
			mimeType: file.type,
			base64: await toBase64(file),
			alt: ""
		} }),
		onSuccess: (asset) => {
			onChange(asset.url);
			setError(null);
			queryClient.invalidateQueries({ queryKey: ["admin-media"] });
		},
		onError: (e) => setError(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id,
					value,
					placeholder: "/api/public/media/… or https://…",
					onChange: (e) => onChange(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => setOpen((v) => !v),
						children: open ? "Close" : "Library"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
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
						}), "Upload"]
					})]
				})]
			}),
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
			value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-lg border border-border bg-card p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: value,
					alt: "",
					className: "h-14 w-20 rounded object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "focus-ring ml-auto rounded p-1 text-muted-foreground hover:text-foreground",
					onClick: () => onChange(""),
					"aria-label": "Remove image",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					})
				})]
			}) : null,
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-64 overflow-auto rounded-lg border border-border bg-card p-3",
				children: media.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading images…"
				}) : (media.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No images uploaded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4",
					children: (media.data ?? []).map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "focus-ring w-full overflow-hidden rounded-lg border border-border",
						onClick: () => {
							onChange(asset.url);
							setOpen(false);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: asset.url,
							alt: asset.alt,
							className: "h-20 w-full object-cover"
						})
					}) }, asset.id))
				})
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error
			}) : null
		]
	});
}
//#endregion
export { MediaPicker as t };
