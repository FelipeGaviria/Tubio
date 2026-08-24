import { createHash } from "node:crypto";

export const ORDER_COOKIE = "tubio_order_access";

export function accessCode() {
  return process.env.ORDER_ACCESS_CODE ?? "5403";
}

export function accessToken() {
  const secret = process.env.ORDER_COOKIE_SECRET ?? accessCode();
  return createHash("sha256").update(`tubio-order:${secret}`).digest("hex");
}
