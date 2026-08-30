import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import {
  clientIp,
  contactSchema,
  deliverEmail,
  fingerprint,
  scoreSpam,
  type ContactResult,
} from "./contact.server";

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<ContactResult> => {
    const request = getRequest();
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const hash = await fingerprint(clientIp(request.headers), userAgent);
    const spamScore = scoreSpam(data);

    // Silent success for obvious bots: never tell them why they failed.
    if (spamScore >= 100) {
      return { ok: true, delivery: "rejected", message: "Thanks — your message was received." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const countSince = async (ms: number) => {
      const { count } = await supabaseAdmin
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("client_hash", hash)
        .gte("created_at", new Date(Date.now() - ms).toISOString());
      return count ?? 0;
    };

    // Two-tier rate limit: burst (3 / 10 min) and sustained (10 / day).
    const [burst, daily] = await Promise.all([
      countSince(10 * 60 * 1000),
      countSince(24 * 60 * 60 * 1000),
    ]);

    if (burst >= 3 || daily >= 10) {
      return {
        ok: false,
        delivery: "rejected",
        message: "You've sent a few messages already. Please try again in a little while.",
      };
    }


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
      delivery_error: email?.error ?? null,
    });

    if (error) {
      console.error("contact_messages insert failed", error);
      return {
        ok: false,
        delivery: "rejected",
        message: "Something went wrong saving your message. Please try again or reach me on GitHub.",
      };
    }

    return {
      ok: true,
      delivery: deliveryStatus,
      message:
        deliveryStatus === "email"
          ? "Message sent — I'll get back to you soon."
          : "Message received and saved. I'll get back to you soon.",
    };
  });
