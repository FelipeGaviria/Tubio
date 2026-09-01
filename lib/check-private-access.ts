import { createHash } from "node:crypto";

const endpoint = "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/validate-private-access";
const publishableKey = "sb_publishable_VBhZcIj3KS9r1nxTaovmBA_QrVQzNzC";

export async function checkPrivateAccess(request: Request, gate: string, code: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? forwarded ?? "unknown";
  const salt = process.env.IP_HASH_SALT ?? process.env.ORDER_COOKIE_SECRET ?? process.env.SOCIAL_COOKIE_SECRET ?? "tubio-private-access-v1";
  const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex");
  const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json", apikey: publishableKey }, body: JSON.stringify({ ipHash, gate, code }), cache: "no-store" });
  return { response, result: await response.json() as { ok?: boolean; token?: string; locked?: boolean; attemptsRemaining?: number } };
}
