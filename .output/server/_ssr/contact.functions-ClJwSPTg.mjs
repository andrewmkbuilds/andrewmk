import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as getRequest } from "./request-response-B7GxCXoC.mjs";
import { a as scoreSpam, i as fingerprint, n as contactSchema, r as deliverEmail, t as clientIp } from "./contact.server-z8_iTars.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact.functions-ClJwSPTg.js
var submitContactMessage_createServerFn_handler = createServerRpc({
	id: "6791d96029119711fff64366333434540863937081e92a2093993c6c31f4287b",
	name: "submitContactMessage",
	filename: "src/lib/contact.functions.ts"
}, (opts) => submitContactMessage.__executeServer(opts));
var submitContactMessage = createServerFn({ method: "POST" }).inputValidator((data) => contactSchema.parse(data)).handler(submitContactMessage_createServerFn_handler, async ({ data }) => {
	const request = getRequest();
	const userAgent = request.headers.get("user-agent") ?? "unknown";
	const hash = await fingerprint(clientIp(request.headers), userAgent);
	const spamScore = scoreSpam(data);
	if (spamScore >= 100) return {
		ok: true,
		delivery: "rejected",
		message: "Thanks — your message was received."
	};
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const countSince = async (ms) => {
		const { count } = await supabaseAdmin.from("contact_messages").select("id", {
			count: "exact",
			head: true
		}).eq("client_hash", hash).gte("created_at", new Date(Date.now() - ms).toISOString());
		return count ?? 0;
	};
	const [burst, daily] = await Promise.all([countSince(6e5), countSince(864e5)]);
	if (burst >= 3 || daily >= 10) return {
		ok: false,
		delivery: "rejected",
		message: "You've sent a few messages already. Please try again in a little while."
	};
	const email = spamScore >= 50 ? null : await deliverEmail(data);
	const deliveryStatus = email?.ok ? "email" : "stored";
	const { error } = await supabaseAdmin.from("contact_messages").insert({
		name: data.name,
		email: data.email,
		message: data.message,
		source_path: data.sourcePath,
		user_agent: userAgent.slice(0, 500),
		client_hash: hash,
		spam_score: spamScore,
		delivery_status: deliveryStatus,
		delivery_error: email?.error ?? null
	});
	if (error) {
		console.error("contact_messages insert failed", error);
		return {
			ok: false,
			delivery: "rejected",
			message: "Something went wrong saving your message. Please try again or reach me on GitHub."
		};
	}
	return {
		ok: true,
		delivery: deliveryStatus,
		message: deliveryStatus === "email" ? "Message sent — I'll get back to you soon." : "Message received and saved. I'll get back to you soon."
	};
});
//#endregion
export { submitContactMessage_createServerFn_handler };
