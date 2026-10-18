globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"fd5-3ZjWIxrQwVOho7lMXzNt11UD3Ss\"",
		"mtime": "2026-10-18T18:44:40.411Z",
		"size": 4053,
		"path": "../public/sitemap.xml"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"100-wtfBDMGMgJ6uHyx55OsiSQfVaaQ\"",
		"mtime": "2026-10-18T18:44:40.411Z",
		"size": 256,
		"path": "../public/robots.txt"
	},
	"/placeholder.svg": {
		"type": "image/svg+xml",
		"etag": "\"cb5-3cfZ/x0uNhX4kurZGAkOBE4K/G0\"",
		"mtime": "2026-10-18T18:44:40.411Z",
		"size": 3253,
		"path": "../public/placeholder.svg"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"1739-X4FtGjM+YIFlaYfwivHIpKreTNk\"",
		"mtime": "2026-10-18T18:44:40.411Z",
		"size": 5945,
		"path": "../public/favicon.png"
	},
	"/assets/StatusDot-BcE-0A5w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c7-/V/INeEoE8ZHQzaWxXlZuoDwFCw\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 455,
		"path": "../public/assets/StatusDot-BcE-0A5w.js"
	},
	"/assets/admin.settings.security-26xmGkSU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a11-9nxHQUYh8mZ33jEeK9ACIVjOf7o\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 6673,
		"path": "../public/assets/admin.settings.security-26xmGkSU.js"
	},
	"/assets/404-Di2FgXzt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47-82HvKR1M7tByOjrdws+jrVUUyN8\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 71,
		"path": "../public/assets/404-Di2FgXzt.js"
	},
	"/assets/link-DmIVlRKu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"241d-X6lZUo5i8JT8YYyA3vzybXx1pcY\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 9245,
		"path": "../public/assets/link-DmIVlRKu.js"
	},
	"/assets/createServerFn-BB39wbFP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9259-ekHbqllW+FSmXIt7OO/SJcIL+9w\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 37465,
		"path": "../public/assets/createServerFn-BB39wbFP.js"
	},
	"/assets/media.functions-B9Ormrks.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"258-6I2M4x9/q7wEkpwF6EorFhfLwVo\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 600,
		"path": "../public/assets/media.functions-B9Ormrks.js"
	},
	"/assets/about-DbAqw8g8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1686-97H0gnhXIR9WdYAiZRjaG2TPrRc\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 5766,
		"path": "../public/assets/about-DbAqw8g8.js"
	},
	"/assets/tslib.es6-Tae09705.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d-qJHuGuq51+EbLaebsBAkbj1JLbk\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 1069,
		"path": "../public/assets/tslib.es6-Tae09705.js"
	},
	"/assets/download-DO2Nv46d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-TE3lMdYHhDill6ySdiyC8zNl/PE\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 232,
		"path": "../public/assets/download-DO2Nv46d.js"
	},
	"/assets/textarea-UnqfcYvD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"223-s/FE7Y+ldxW9k2UoOR+VKNOGx7M\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 547,
		"path": "../public/assets/textarea-UnqfcYvD.js"
	},
	"/assets/profile-B9LP2cEI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"239a-ZnJqzAH+bhRcXo52pKGUqgrd43w\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 9114,
		"path": "../public/assets/profile-B9LP2cEI.js"
	},
	"/assets/admin-contact.functions-C3HYOMQ6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2248-5P2d2L79cKwwjoTDuaiMZtKJ8XQ\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 8776,
		"path": "../public/assets/admin-contact.functions-C3HYOMQ6.js"
	},
	"/assets/ProjectGrid-BkvT_Xk5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"340f-9XK2G2i9hxJecswQzugAZyT0JUg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 13327,
		"path": "../public/assets/ProjectGrid-BkvT_Xk5.js"
	},
	"/assets/admin.blog-FXc9BGTM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25d9-oZFkU/K2PIc0RkknnWWv4G1LqaI\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 9689,
		"path": "../public/assets/admin.blog-FXc9BGTM.js"
	},
	"/assets/SectionHeading-CzDCo4Iz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"314-dt/haabdsPRHz0AKRaelMbY82Yk\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 788,
		"path": "../public/assets/SectionHeading-CzDCo4Iz.js"
	},
	"/assets/projects._slug-BSb9Pi8S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2aa1-gBXzigdpnKy8aWG03GcOYeTiGoI\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 10913,
		"path": "../public/assets/projects._slug-BSb9Pi8S.js"
	},
	"/assets/projects.functions-CeSM-xew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39e-9rBKBwvKJgHUX4UinJgOgLJMGfs\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 926,
		"path": "../public/assets/projects.functions-CeSM-xew.js"
	},
	"/assets/journey-BneuUJbe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120c-Fi0Rb8JA43yb+FN8ft93Awe7/ik\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 4620,
		"path": "../public/assets/journey-BneuUJbe.js"
	},
	"/assets/blog.functions-HGofBFAg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-vXXTnX0q2uE5E2l8luQrQBb5+w4\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 694,
		"path": "../public/assets/blog.functions-HGofBFAg.js"
	},
	"/assets/useNavigate-DT7ghfdY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd-NRw/P+j8Y9+d6YilTDLWWsCfPGM\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 189,
		"path": "../public/assets/useNavigate-DT7ghfdY.js"
	},
	"/assets/andrewbuilds-logo-DtJESMmQ.png": {
		"type": "image/png",
		"etag": "\"2c98f-fK0lA0Ged7thHFaGHMCHPEN+84w\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 182671,
		"path": "../public/assets/andrewbuilds-logo-DtJESMmQ.png"
	},
	"/assets/certificates-Crz7uZgV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d63-D82e7C6YvprHLsyKj3yzFjIFwOw\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 11619,
		"path": "../public/assets/certificates-Crz7uZgV.js"
	},
	"/assets/auth-CAc-FXGc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10ed-SzWkwEI4SA530ZuJkot508VuOiM\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 4333,
		"path": "../public/assets/auth-CAc-FXGc.js"
	},
	"/assets/trash-2-Ct5aGOwH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27e-9iYOn0Dt4OhVa1GBpvVG91ol1o4\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 638,
		"path": "../public/assets/trash-2-Ct5aGOwH.js"
	},
	"/assets/label-DJFeGx3-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ac-EvVTOCcGjWnbPFzBFNqKEmWCW3g\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 684,
		"path": "../public/assets/label-DJFeGx3-.js"
	},
	"/assets/admin.settings-Cnkc9I9k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c1-6trB7fgaTkTnZ1NS+vMitTy0rOg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 2497,
		"path": "../public/assets/admin.settings-Cnkc9I9k.js"
	},
	"/assets/blog._slug-BQIHJ-Dx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f-OaKvfFk09XAZ+iCxPBGZK83HHoc\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 79,
		"path": "../public/assets/blog._slug-BQIHJ-Dx.js"
	},
	"/assets/circle-check-DadzO49v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-+8wmeN+LgfDTK3zQNij4Ms3x0Jk\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 178,
		"path": "../public/assets/circle-check-DadzO49v.js"
	},
	"/assets/input-CaWyZIrD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"285-WtZ1zWLrbT2vXS18GSIy6puos/g\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 645,
		"path": "../public/assets/input-CaWyZIrD.js"
	},
	"/assets/external-link-CNE84zy5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-AnyH1g13sg2QN0wAveCQzV3Y4DE\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 251,
		"path": "../public/assets/external-link-CNE84zy5.js"
	},
	"/assets/MediaPicker-DuL7r9pB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e71-P1pnSl1yNodetOD7mYyhGcR+Spc\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 3697,
		"path": "../public/assets/MediaPicker-DuL7r9pB.js"
	},
	"/assets/query-ChnAxaHA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a2c-5Xpz+afUBxHKZdO9phKQIeGnhQQ\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 14892,
		"path": "../public/assets/query-ChnAxaHA.js"
	},
	"/assets/ContactForm-ATLIb8u9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11e1-4sWqyuzran+ziSr18Ytc0JGXMCg\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 4577,
		"path": "../public/assets/ContactForm-ATLIb8u9.js"
	},
	"/assets/useMutation-Vxfna95o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"946-U4Q/VdIe8aTFwyQhhArQen6fl0o\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 2374,
		"path": "../public/assets/useMutation-Vxfna95o.js"
	},
	"/assets/Reveal-BMOpdsgp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75b-pDDQ/5JiwHXTfyXuzlH4Yn5XbY0\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 1883,
		"path": "../public/assets/Reveal-BMOpdsgp.js"
	},
	"/assets/preload-helper-dNLfVPGf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"227d-meetwMG4oeWF3WP4RoG8SFogpPs\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 8829,
		"path": "../public/assets/preload-helper-dNLfVPGf.js"
	},
	"/assets/loader-circle-HT9Tmuv7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-XxXP5HEpIvGxw0O5o4ttE7J2MeM\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 144,
		"path": "../public/assets/loader-circle-HT9Tmuv7.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/blog._slug-DnvoIBYu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3f-LUjWmX+pvLFERpKDKpK/sHIlKJw\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 3135,
		"path": "../public/assets/blog._slug-DnvoIBYu.js"
	},
	"/assets/rotate-ccw-S6rNnYX9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8-PzY2OSGTahPmDLkY1JRjbg3HTY4\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 200,
		"path": "../public/assets/rotate-ccw-S6rNnYX9.js"
	},
	"/assets/route-Ce1poeWX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-YKDvIazlHPoTtAf1ZTuMjbaho+s\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 139,
		"path": "../public/assets/route-Ce1poeWX.js"
	},
	"/assets/admin.media-C6Hx9eBL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e7a-1TSW7ya0g7CEO52lj0VsIiCPcCw\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 3706,
		"path": "../public/assets/admin.media-C6Hx9eBL.js"
	},
	"/assets/useRouter-Dpb7RwMI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2144-OAWOWZt+i/sSs5fMTIk74KvSiew\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 8516,
		"path": "../public/assets/useRouter-Dpb7RwMI.js"
	},
	"/assets/dist-BOIqWXiH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102d-2SZkfLlXE+K68rYo8u+t1HioCbM\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 4141,
		"path": "../public/assets/dist-BOIqWXiH.js"
	},
	"/assets/Layout-DJ4JsPvS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e4d3-JlTJr+Ve3lCbVSdnduGnbwQKOEg\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 255187,
		"path": "../public/assets/Layout-DJ4JsPvS.js"
	},
	"/assets/contact-B7ZnSARb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ffe-Ua0yv5FoLj3MCiyM0ESPbJCYKZw\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 4094,
		"path": "../public/assets/contact-B7ZnSARb.js"
	},
	"/assets/MfaPanel-1VYi023x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1260-YefbZKLK7tk8OlMWE6fH9XW6UeM\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 4704,
		"path": "../public/assets/MfaPanel-1VYi023x.js"
	},
	"/assets/auth-middleware-JDjVgB0Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c-E5N3ct+04FLjw+DnBCmxYLSbRrU\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 332,
		"path": "../public/assets/auth-middleware-JDjVgB0Q.js"
	},
	"/assets/index-B3w9JbSP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86c6f-3rgUpaYVnhJ65oViE03lZoqXtpE\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 552047,
		"path": "../public/assets/index-B3w9JbSP.js"
	},
	"/assets/admin.projects-DUiRNH4B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"283d-9rNcAiyNrph3ZIdr1uXJuTasaKU\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 10301,
		"path": "../public/assets/admin.projects-DUiRNH4B.js"
	},
	"/assets/x-DNo6FfLj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-0S0X1xd0tV6sPvElV3opveDg8lA\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 154,
		"path": "../public/assets/x-DNo6FfLj.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/button-DyuDyHEh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7cd5-VqhNGkvgRD1IvIncSz7sAfD/uh8\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 31957,
		"path": "../public/assets/button-DyuDyHEh.js"
	},
	"/assets/project-schema-DhBZBQS_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d5-cmor82fzEuLB/xqOpzA+E3F9Klg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 1749,
		"path": "../public/assets/project-schema-DhBZBQS_.js"
	},
	"/assets/useServerFn-Dt5A2SYO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"177-kPjXil1KVtiCEsNXV1ZiApz/IAA\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 375,
		"path": "../public/assets/useServerFn-Dt5A2SYO.js"
	},
	"/assets/AdminShell-DaGoe4k4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"782-0UJV25mmd/75inwpPKqcGTJZeGY\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 1922,
		"path": "../public/assets/AdminShell-DaGoe4k4.js"
	},
	"/assets/admin.messages-zrAf0YHj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e5c-cYhLhI3BuQgoyPYufRPcv8RPVXw\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 7772,
		"path": "../public/assets/admin.messages-zrAf0YHj.js"
	},
	"/assets/resume-DfUmxAvi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f22-0CDi8tD1cVfDea8rX4sdFGDNVFg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 7970,
		"path": "../public/assets/resume-DfUmxAvi.js"
	},
	"/assets/routes-DxJgck22.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d48-uUN0STRzKKP7KIEUXM1tosKW1DM\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 40264,
		"path": "../public/assets/routes-DxJgck22.js"
	},
	"/assets/TechTag-hK3AcViW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-OuE9HmcVomXNwTb9fbCUiSLg/bg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 321,
		"path": "../public/assets/TechTag-hK3AcViW.js"
	},
	"/assets/arrow-right-DRQRRW8y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-wVU3+8pgMprf8gK8q0GqLrYJBEU\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 165,
		"path": "../public/assets/arrow-right-DRQRRW8y.js"
	},
	"/assets/styles-C9FFol-c.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"21c1c-lI8G/s6oFtGDG43WgDR4Q+luHcg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 138268,
		"path": "../public/assets/styles-C9FFol-c.css"
	},
	"/assets/projects._slug-BQIHJ-Dx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f-OaKvfFk09XAZ+iCxPBGZK83HHoc\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 79,
		"path": "../public/assets/projects._slug-BQIHJ-Dx.js"
	},
	"/assets/createLucideIcon-DyOSRp63.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a9-dTv5qA6SVdB7n2jncSGFybo83Gg\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 1193,
		"path": "../public/assets/createLucideIcon-DyOSRp63.js"
	},
	"/assets/BuiltBy-C5fQQBED.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cc-KrqIJ6SEkv1btra9L59m199MCeQ\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 2252,
		"path": "../public/assets/BuiltBy-C5fQQBED.js"
	},
	"/assets/arrow-left-ChghSQK_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-Wm9Z3sf3C0eijiUDYaawsaKkXPU\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 165,
		"path": "../public/assets/arrow-left-ChghSQK_.js"
	},
	"/assets/admin.index-Oa6iXMuK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1d-befoNDECUCWac8lP9u1z0uINpJk\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 3357,
		"path": "../public/assets/admin.index-Oa6iXMuK.js"
	},
	"/assets/FilterBar-DSa-b6Xe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f8-AJQUznzICJDC6Zxj1y8DCGBND5k\"",
		"mtime": "2026-10-18T18:44:39.887Z",
		"size": 1272,
		"path": "../public/assets/FilterBar-DSa-b6Xe.js"
	},
	"/assets/matchContext-ClY2McYo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-0DJka/KgM202iThmEu3d5fd4YPY\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 140,
		"path": "../public/assets/matchContext-ClY2McYo.js"
	},
	"/assets/achievements-4Jj7sgp8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a0c-2Nt+Xrtr3yZ0J08HnVgb4trdIDA\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 18956,
		"path": "../public/assets/achievements-4Jj7sgp8.js"
	},
	"/assets/projects.index-_1rlhDu8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c6-4z+DEtGlD+ungWCeeBboRRkb5N0\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 1990,
		"path": "../public/assets/projects.index-_1rlhDu8.js"
	},
	"/assets/blog.index-DbOCMFyY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ddf-76TETJTUeGPfFMe1F1KfN6ggfzQ\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 3551,
		"path": "../public/assets/blog.index-DbOCMFyY.js"
	},
	"/assets/useSelector-wdOmz881.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"832-ofXjKmPCRrR0TM+KmAc7MKZ51A8\"",
		"mtime": "2026-10-18T18:44:39.891Z",
		"size": 2098,
		"path": "../public/assets/useSelector-wdOmz881.js"
	},
	"/og/journey.png": {
		"type": "image/png",
		"etag": "\"feba-7joiJ1NtZ2qihm5MbjcczAJFfq0\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 65210,
		"path": "../public/og/journey.png"
	},
	"/og/profile.png": {
		"type": "image/png",
		"etag": "\"1091d-RNQA1lyI3+jQmh24z71gWV4iFTw\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 67869,
		"path": "../public/og/profile.png"
	},
	"/og/resume.png": {
		"type": "image/png",
		"etag": "\"10a69-9C8Sus/ZTUDTu4Xo/DETFYPiEzU\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 68201,
		"path": "../public/og/resume.png"
	},
	"/og/home.png": {
		"type": "image/png",
		"etag": "\"10260-2i1Se1HN3R6aHfM9cW4N38pW32A\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 66144,
		"path": "../public/og/home.png"
	},
	"/og/contact.png": {
		"type": "image/png",
		"etag": "\"d936-CMMh1opTI2Nw4Q9ESNaZYb8NBgs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 55606,
		"path": "../public/og/contact.png"
	},
	"/og/websites.png": {
		"type": "image/png",
		"etag": "\"e6c4-7erhdsZe07WX8lTb2yV8twLyza0\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 59076,
		"path": "../public/og/websites.png"
	},
	"/certificates/datacamp-digital-transformation-google-cloud-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"7dc4d-diYT96WjR0s5hZQLjsVa1B8vD4A\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 515149,
		"path": "../public/certificates/datacamp-digital-transformation-google-cloud-certificate.jpg"
	},
	"/certificates/6t-techfest-data-science-participation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f061-CdBsxtNLgc6aIWCjy8Pa2qIufHc\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 127073,
		"path": "../public/certificates/6t-techfest-data-science-participation-certificate.jpg"
	},
	"/og/404.png": {
		"type": "image/png",
		"etag": "\"a9e7-yWGz4R67OEiTM05RT6y+tFWsUhA\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 43495,
		"path": "../public/og/404.png"
	},
	"/og/about.png": {
		"type": "image/png",
		"etag": "\"efa8-kElmKby2lF4yWmf+L9rZDVz/mkw\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 61352,
		"path": "../public/og/about.png"
	},
	"/og/achievements.png": {
		"type": "image/png",
		"etag": "\"fc98-4AV6z/rkHy72OqjriTRF4eUQfVs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 64664,
		"path": "../public/og/achievements.png"
	},
	"/og/projects.png": {
		"type": "image/png",
		"etag": "\"e133-TLA/In2BHEYTv+4TgQukYMgoNLw\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 57651,
		"path": "../public/og/projects.png"
	},
	"/certificates/datacamp-trust-security-google-cloud-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"7e0cb-6TFwvXDFcTCGCHPU/w4J/py45cs\"",
		"mtime": "2026-10-18T18:44:40.411Z",
		"size": 516299,
		"path": "../public/certificates/datacamp-trust-security-google-cloud-certificate.jpg"
	},
	"/certificates/7v-techfest-digiquizz-participation-certifcate.jpg": {
		"type": "image/jpeg",
		"etag": "\"25b2f-JebC2cnpSV3QTp+2bqQsQTmzBog\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 154415,
		"path": "../public/certificates/7v-techfest-digiquizz-participation-certifcate.jpg"
	},
	"/certificates/tks-offer-letter.jpg": {
		"type": "image/jpeg",
		"etag": "\"444b1-NjrkvI3wWJ9h4BL4I25XGcF2y3c\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 279729,
		"path": "../public/certificates/tks-offer-letter.jpg"
	},
	"/certificates/6t-techfest-design-participation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ee26-jJygqwAPpiM95P4yKdsIW+jAEqY\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 126502,
		"path": "../public/certificates/6t-techfest-design-participation-certificate.jpg"
	},
	"/certificates/7v-sports-day-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1fab6-1OA9sgqlDFYc0Jb1MTVBUreZC0Y\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 129718,
		"path": "../public/certificates/7v-sports-day-certificate.jpg"
	},
	"/certificates/claude-code-101-certificate.pdf": {
		"type": "application/pdf",
		"etag": "\"17ef0-PR3CRUSzyRa+wmdCgFhv5KwbyvA\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 98032,
		"path": "../public/certificates/claude-code-101-certificate.pdf"
	},
	"/certificates/6t-skill-up-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"22bef-crofH6CsXD2JaLYxxw/NL7F3/1E\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 142319,
		"path": "../public/certificates/6t-skill-up-certificate.jpg"
	},
	"/certificates/claude-101-certificate.pdf": {
		"type": "application/pdf",
		"etag": "\"15848-xqu+p7goLhwAwBMkKbfrxWQJdZA\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 88136,
		"path": "../public/certificates/claude-101-certificate.pdf"
	},
	"/certificates/7v-uae-sst-exhibition-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1e168-o3F47ripf0IdyxiNs0REDkDgPJo\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 123240,
		"path": "../public/certificates/7v-uae-sst-exhibition-certificate.jpg"
	},
	"/certificates/7v-mun-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1fe47-XLRgtlo5jb2jPvgnJUTDPNwdONM\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 130631,
		"path": "../public/certificates/7v-mun-certificate.jpg"
	},
	"/certificates/6t-techfest-space-tech-appreciation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1f583-xb3TIeCy0yLU7OaXl4Fo024oakM\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 128387,
		"path": "../public/certificates/6t-techfest-space-tech-appreciation-certificate.jpg"
	},
	"/certificates/6t-math-exhibition-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1e7ec-Hp8LvC7LpRVxEiPnPrSvXhN9gcc\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 124908,
		"path": "../public/certificates/6t-math-exhibition-certificate.jpg"
	},
	"/certificates/hackerrank-software-engineer-intern-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"9e1ab-EbfGSxkxXRSt64H+QQXq0HoP71E\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 647595,
		"path": "../public/certificates/hackerrank-software-engineer-intern-certificate.jpg"
	},
	"/certificates/6t-techfest-space-tech-certificate-of-merit.jpg": {
		"type": "image/jpeg",
		"etag": "\"69722-KlkS3wRzUXUdIyfeDELDoNVU9JE\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 431906,
		"path": "../public/certificates/6t-techfest-space-tech-certificate-of-merit.jpg"
	},
	"/certificates/7v-techfest-data-science-certificate-of-merit.jpg": {
		"type": "image/jpeg",
		"etag": "\"80fea-2o9O0s8LeGWaunkrvos8MTf3lOs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 528362,
		"path": "../public/certificates/7v-techfest-data-science-certificate-of-merit.jpg"
	},
	"/certificates/5y-republic-day-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ebe8-p/X9tWzezkWJTIQ4EtPPw4qj+U4\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 125928,
		"path": "../public/certificates/5y-republic-day-certificate.jpg"
	},
	"/certificates/7v-robotics-course-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"26b10-5j18br2e+Lx7oX/CmGPUmgPpOgs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 158480,
		"path": "../public/certificates/7v-robotics-course-certificate.jpg"
	},
	"/certificates/mongodb-indexing-design-fundamentals-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"4fd9d-u15WfhriBBsnT10a4BCk/Dra1Dc\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 327069,
		"path": "../public/certificates/mongodb-indexing-design-fundamentals-certificate.jpg"
	},
	"/certificates/6t-techfest-coding-participation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1eeaf-mFcXuqh2bBycgLPlyZzN9YgC+vU\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 126639,
		"path": "../public/certificates/6t-techfest-coding-participation-certificate.jpg"
	},
	"/certificates/7v-techfest-iot-certificate-of-merit.jpg": {
		"type": "image/jpeg",
		"etag": "\"806fd-hysRQPNe/1rGZKw0mScvPTfcMtg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 526077,
		"path": "../public/certificates/7v-techfest-iot-certificate-of-merit.jpg"
	},
	"/certificates/datacamp-innovating-google-cloud-ai-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"7abf0-DcNIswa2LkIjMKy/LNrFpyco5eo\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 502768,
		"path": "../public/certificates/datacamp-innovating-google-cloud-ai-certificate.jpg"
	},
	"/certificates/4n-creative-model-presentation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"611d6-d1auq+jEWGkuvjbx7FMlN+AmSWQ\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 397782,
		"path": "../public/certificates/4n-creative-model-presentation-certificate.jpg"
	},
	"/certificates/fll-participation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"8c7d1-IG4FGI5jBXayQBu8bwf1xUHDdKI\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 575441,
		"path": "../public/certificates/fll-participation-certificate.jpg"
	},
	"/certificates/datacamp-modernize-infrastructure-google-cloud-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"827d8-cfNxpAkIwwAycLxQgvGVaWz3NmU\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 534488,
		"path": "../public/certificates/datacamp-modernize-infrastructure-google-cloud-certificate.jpg"
	},
	"/certificates/6t-tech-exhibition-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"202e0-5PAULAi+uARSDmnXtEzRx3wO/Os\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 131808,
		"path": "../public/certificates/6t-tech-exhibition-certificate.jpg"
	},
	"/certificates/mongodb-crud-operations-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"4c02d-+VDNE8tfdV5wEB5T3AQKe0/4/Bg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 311341,
		"path": "../public/certificates/mongodb-crud-operations-certificate.jpg"
	},
	"/certificates/4n-robotics-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"64f57-Pr70gKjvClBGh3Z4FSa5nvb20YU\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 413527,
		"path": "../public/certificates/4n-robotics-certificate.jpg"
	},
	"/certificates/certificate-andrew-mathews.pdf": {
		"type": "application/pdf",
		"etag": "\"3c0422-vKCYP22p0lmjy90Zy74sYqGH1RY\"",
		"mtime": "2026-10-18T18:44:40.411Z",
		"size": 3933218,
		"path": "../public/certificates/certificate-andrew-mathews.pdf"
	},
	"/certificates/6t-sst-exhibition-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ea42-IO2NuCPkLkxlRDtKfU1Oxweh5qY\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 125506,
		"path": "../public/certificates/6t-sst-exhibition-certificate.jpg"
	},
	"/certificates/fll-innovation-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"9a42d-YrO+fEbcoO9fxkGy1JTXW9nscqg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 631853,
		"path": "../public/certificates/fll-innovation-certificate.jpg"
	},
	"/certificates/thumbs/6t-sst-exhibition-certificate.webp": {
		"type": "image/webp",
		"etag": "\"62c6-MOjspbnwjyu4GrUGM6KDpkinfwg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25286,
		"path": "../public/certificates/thumbs/6t-sst-exhibition-certificate.webp"
	},
	"/certificates/ai-fluency-for-students-certificate.pdf": {
		"type": "application/pdf",
		"etag": "\"2513d-vSgsvstv6gSEBBayXPBSjCmdiIg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 151869,
		"path": "../public/certificates/ai-fluency-for-students-certificate.pdf"
	},
	"/certificates/hackerrank-frontend-developer-react-certificate.jpg": {
		"type": "image/jpeg",
		"etag": "\"9ecf0-MJGoVSdFLsU3iypfKh3z/aaZS+A\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 650480,
		"path": "../public/certificates/hackerrank-frontend-developer-react-certificate.jpg"
	},
	"/certificates/thumbs/7v-techfest-digiquizz-participation-certifcate.webp": {
		"type": "image/webp",
		"etag": "\"b414-hQL89UOUKdhuwZefeApRtCxezHw\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 46100,
		"path": "../public/certificates/thumbs/7v-techfest-digiquizz-participation-certifcate.webp"
	},
	"/certificates/thumbs/claude-101-certificate.webp": {
		"type": "image/webp",
		"etag": "\"21ec-zjYuIuaYhUsf969BUzcvF2MGaWY\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 8684,
		"path": "../public/certificates/thumbs/claude-101-certificate.webp"
	},
	"/certificates/thumbs/4n-creative-model-presentation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"561c-lSgoj62OGgtcmyytFPwZuAuJFKs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 22044,
		"path": "../public/certificates/thumbs/4n-creative-model-presentation-certificate.webp"
	},
	"/certificates/thumbs/7v-uae-sst-exhibition-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6060-womEpF2Dcp4omSCPGDJ4Bx8ou80\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 24672,
		"path": "../public/certificates/thumbs/7v-uae-sst-exhibition-certificate.webp"
	},
	"/certificates/thumbs/tks-offer-letter.webp": {
		"type": "image/webp",
		"etag": "\"8ab4-p+7youOYpsz2CLkTAmLAoqbTymc\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 35508,
		"path": "../public/certificates/thumbs/tks-offer-letter.webp"
	},
	"/certificates/thumbs/6t-techfest-data-science-participation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"65c8-+E4dPmefghA5Sq8koXceLuL9Hws\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 26056,
		"path": "../public/certificates/thumbs/6t-techfest-data-science-participation-certificate.webp"
	},
	"/certificates/thumbs/datacamp-trust-security-google-cloud-certificate.webp": {
		"type": "image/webp",
		"etag": "\"699c-wGpmmsbZUQhbUSSM4di7vLTt+d8\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 27036,
		"path": "../public/certificates/thumbs/datacamp-trust-security-google-cloud-certificate.webp"
	},
	"/certificates/thumbs/5y-republic-day-certificate.webp": {
		"type": "image/webp",
		"etag": "\"64bc-UvNzNFDAqHd3mCenliKFK4o9K7k\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25788,
		"path": "../public/certificates/thumbs/5y-republic-day-certificate.webp"
	},
	"/certificates/thumbs/7v-mun-certificate.webp": {
		"type": "image/webp",
		"etag": "\"8d02-9zHEs9gkyqnHs2wLI6sxb/oqZJs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 36098,
		"path": "../public/certificates/thumbs/7v-mun-certificate.webp"
	},
	"/certificates/thumbs/6t-techfest-space-tech-certificate-of-merit.webp": {
		"type": "image/webp",
		"etag": "\"6ca0-iOKcSPf0p1LP4qaCGbN1w3ZfciM\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 27808,
		"path": "../public/certificates/thumbs/6t-techfest-space-tech-certificate-of-merit.webp"
	},
	"/certificates/thumbs/datacamp-modernize-infrastructure-google-cloud-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6f64-hAOCZfzuBD/Bi37/woaimgFA2FQ\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 28516,
		"path": "../public/certificates/thumbs/datacamp-modernize-infrastructure-google-cloud-certificate.webp"
	},
	"/certificates/thumbs/fll-participation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"8972-lurkBv3tsvwRytsbBzM7cDe+HMY\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 35186,
		"path": "../public/certificates/thumbs/fll-participation-certificate.webp"
	},
	"/certificates/thumbs/7v-sports-day-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6686-RPco45ujPojoBJu3mWIvwppRBXQ\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 26246,
		"path": "../public/certificates/thumbs/7v-sports-day-certificate.webp"
	},
	"/certificates/thumbs/hackerrank-software-engineer-intern-certificate.webp": {
		"type": "image/webp",
		"etag": "\"64aa-43p2z2zXtAkSoO9iecNRzjK1p9k\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25770,
		"path": "../public/certificates/thumbs/hackerrank-software-engineer-intern-certificate.webp"
	},
	"/certificates/thumbs/6t-math-exhibition-certificate.webp": {
		"type": "image/webp",
		"etag": "\"626c-EzAi86Zbgw4xYiahwQBJBKlXzew\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25196,
		"path": "../public/certificates/thumbs/6t-math-exhibition-certificate.webp"
	},
	"/certificates/thumbs/7v-techfest-iot-certificate-of-merit.webp": {
		"type": "image/webp",
		"etag": "\"9fb2-LnUNAk+xTGijAZl8WQlKDjDno+E\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 40882,
		"path": "../public/certificates/thumbs/7v-techfest-iot-certificate-of-merit.webp"
	},
	"/certificates/thumbs/6t-techfest-coding-participation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6558-7Sx/UulEnFqg9TwbrX+DV4xjA8s\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25944,
		"path": "../public/certificates/thumbs/6t-techfest-coding-participation-certificate.webp"
	},
	"/certificates/thumbs/6t-techfest-design-participation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6578-wVHz8SMYGkG2RB9f/nz5QvjzGsg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25976,
		"path": "../public/certificates/thumbs/6t-techfest-design-participation-certificate.webp"
	},
	"/certificates/thumbs/ai-fluency-for-students-certificate.webp": {
		"type": "image/webp",
		"etag": "\"2dc4-ktbqmFxoc1jeexQtvdlkVdlSzmA\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 11716,
		"path": "../public/certificates/thumbs/ai-fluency-for-students-certificate.webp"
	},
	"/certificates/thumbs/mongodb-crud-operations-certificate.webp": {
		"type": "image/webp",
		"etag": "\"4e7e-wT2t/KZcaFMAWUQnb8BOaRyNWqk\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 20094,
		"path": "../public/certificates/thumbs/mongodb-crud-operations-certificate.webp"
	},
	"/certificates/thumbs/6t-skill-up-certificate.webp": {
		"type": "image/webp",
		"etag": "\"90fc-1mqjkAeQ0kHP9/6Nn4tvAboEsKk\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 37116,
		"path": "../public/certificates/thumbs/6t-skill-up-certificate.webp"
	},
	"/certificates/thumbs/certificate-andrew-mathews.webp": {
		"type": "image/webp",
		"etag": "\"55a4-uYKTV1/Lt2dJFCI5Qw0ewF77rSM\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 21924,
		"path": "../public/certificates/thumbs/certificate-andrew-mathews.webp"
	},
	"/certificates/thumbs/datacamp-digital-transformation-google-cloud-certificate.webp": {
		"type": "image/webp",
		"etag": "\"695e-Ng4aAxxnA8fBJUD4Ny2omcIWRTA\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 26974,
		"path": "../public/certificates/thumbs/datacamp-digital-transformation-google-cloud-certificate.webp"
	},
	"/certificates/thumbs/claude-code-101-certificate.webp": {
		"type": "image/webp",
		"etag": "\"20d2-KJiso3VQs8Omp6c3omI4i8GsIzQ\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 8402,
		"path": "../public/certificates/thumbs/claude-code-101-certificate.webp"
	},
	"/certificates/thumbs/4n-robotics-certificate.webp": {
		"type": "image/webp",
		"etag": "\"5df8-IXNRS1cMS8AXh55NIh9rqUo5jg4\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 24056,
		"path": "../public/certificates/thumbs/4n-robotics-certificate.webp"
	},
	"/certificates/thumbs/7v-techfest-data-science-certificate-of-merit.webp": {
		"type": "image/webp",
		"etag": "\"a1ae-+vEdK+8i0yvZ6uBKhU2S028hrGA\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 41390,
		"path": "../public/certificates/thumbs/7v-techfest-data-science-certificate-of-merit.webp"
	},
	"/certificates/thumbs/datacamp-innovating-google-cloud-ai-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6372-MEmg1Xm9Lmt22yLPHRSvgdJYsLg\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25458,
		"path": "../public/certificates/thumbs/datacamp-innovating-google-cloud-ai-certificate.webp"
	},
	"/certificates/thumbs/6t-tech-exhibition-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6a46-gHFyMyqyngweivB+NmM54/ObyH4\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 27206,
		"path": "../public/certificates/thumbs/6t-tech-exhibition-certificate.webp"
	},
	"/certificates/thumbs/mongodb-indexing-design-fundamentals-certificate.webp": {
		"type": "image/webp",
		"etag": "\"53d0-5bbrYo4Sdtj10BF8zWoXhlt1dLQ\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 21456,
		"path": "../public/certificates/thumbs/mongodb-indexing-design-fundamentals-certificate.webp"
	},
	"/certificates/thumbs/hackerrank-frontend-developer-react-certificate.webp": {
		"type": "image/webp",
		"etag": "\"6550-usYqktTqJlLcpHsfWTI5cfdeWlI\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 25936,
		"path": "../public/certificates/thumbs/hackerrank-frontend-developer-react-certificate.webp"
	},
	"/certificates/thumbs/7v-robotics-course-certificate.webp": {
		"type": "image/webp",
		"etag": "\"ba14-4lgKQlPT+7XkcnxZTlzq8oodiqk\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 47636,
		"path": "../public/certificates/thumbs/7v-robotics-course-certificate.webp"
	},
	"/certificates/thumbs/6t-techfest-space-tech-appreciation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"67ce-Ab+nUs4r37VOvwRZcGYlIuRRrGo\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 26574,
		"path": "../public/certificates/thumbs/6t-techfest-space-tech-appreciation-certificate.webp"
	},
	"/certificates/thumbs/fll-innovation-certificate.webp": {
		"type": "image/webp",
		"etag": "\"9778-5ntkx6gbKtRNcCDLRSjqrbDHKqs\"",
		"mtime": "2026-10-18T18:44:40.407Z",
		"size": 38776,
		"path": "../public/certificates/thumbs/fll-innovation-certificate.webp"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_IO091Z = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_IO091Z
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
