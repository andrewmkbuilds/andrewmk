import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/contact.server-z8_iTars.js
var contactSchema = objectType({
	name: stringType().trim().min(2, "Please enter your name.").max(100),
	email: stringType().trim().email("Please enter a valid email address.").max(200),
	message: stringType().trim().min(10, "Please write at least 10 characters.").max(4e3, "Please keep it under 4000 characters."),
	/** Honeypot — must stay empty. */
	company: stringType().max(200).optional().default(""),
	/** ms the form was on screen before submit; bots submit instantly. */
	elapsedMs: numberType().int().nonnegative().optional().default(0),
	sourcePath: stringType().max(200).optional().default("/contact")
});
var LINK_PATTERN = /\bhttps?:\/\/\S+/gi;
var SPAM_WORDS = /\b(seo services|crypto|casino|viagra|backlinks|loan offer|bitcoin)\b/i;
function scoreSpam(input) {
	let score = 0;
	if (input.company.trim().length > 0) score += 100;
	if (input.elapsedMs > 0 && input.elapsedMs < 2e3) score += 40;
	const links = input.message.match(LINK_PATTERN) ?? [];
	if (links.length >= 3) score += 40;
	else if (links.length > 0) score += 10;
	if (SPAM_WORDS.test(input.message)) score += 50;
	if (/(.)\1{15,}/.test(input.message)) score += 30;
	if (input.message.trim().split(/\s+/).length < 3) score += 20;
	return score;
}
/** Stable, non-reversible visitor fingerprint used only for rate limiting. */
async function fingerprint(ip, userAgent) {
	const data = new TextEncoder().encode(`${ip}|${userAgent}`);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(digest)].slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function clientIp(headers) {
	return headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? "unknown";
}
var escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[c]);
/**
* Sends the notification email when a provider is configured.
* Returns null when no provider is configured (caller falls back to storage only).
*/
async function deliverEmail(input) {
	const apiKey = processModule.env["RESEND_API_KEY"];
	const to = processModule.env["CONTACT_TO_EMAIL"];
	if (!apiKey || !to) return null;
	const from = processModule.env["CONTACT_FROM_EMAIL"] ?? "Portfolio <onboarding@resend.dev>";
	/**
	* Until a sending domain is verified, the default sender may only deliver to
	* the mailbox that owns the email account. When that happens we retry to this
	* address so the notification still lands somewhere real.
	*/
	const fallbackTo = processModule.env["CONTACT_FALLBACK_EMAIL"];
	const html = `<h2>New portfolio message</h2>
<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
<p><strong>Page:</strong> ${escapeHtml(input.sourcePath)}</p>
<hr />
<p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>`;
	const send = async (recipient) => {
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from,
				to: [recipient],
				reply_to: input.email,
				subject: `Portfolio contact — ${input.name}`,
				html
			})
		});
		if (!response.ok) return {
			ok: false,
			error: `${response.status} ${await response.text()}`.slice(0, 500)
		};
		return { ok: true };
	};
	try {
		const first = await send(to);
		if (first.ok) return first;
		if (typeof first.error === "string" && first.error.includes("only send testing emails") && fallbackTo && fallbackTo !== to) {
			const second = await send(fallbackTo);
			if (second.ok) return second;
			return {
				ok: false,
				error: `${first.error} | fallback: ${second.error}`.slice(0, 500)
			};
		}
		return first;
	} catch (error) {
		return {
			ok: false,
			error: error.message.slice(0, 500)
		};
	}
}
//#endregion
export { scoreSpam as a, fingerprint as i, contactSchema as n, deliverEmail as r, clientIp as t };
