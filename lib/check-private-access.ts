import { createHash } from "node:crypto";

const endpoint = "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/validate-private-access";
const publishableKey = "sb_publishable_VBhZcIj3KS9r1nxTaovmBA_QrVQzNzC";

export async function checkPrivateAccess(request: Request, gate: string, code: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? forwarded ?? "unknown";
  const ipHash = createHash("sha256").update(`${process.env.IP_HASH_SALT ?? "tubio-access-v1"}:${ip}`).digest("hex");
  const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json", apikey: publishableKey }, body: JSON.stringify({ ipHash, gate, code }), cache: "no-store" });
  return { response, result: await response.json() as { locked?: boolean; attemptsRemaining?: number } };
}
