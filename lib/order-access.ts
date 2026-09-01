import { createHash } from "node:crypto";

export const ORDER_COOKIE = "tubio_order_access";

export function accessCode() {
  const value = process.env.ORDER_ACCESS_CODE;
  if (!value) throw new Error("Falta ORDER_ACCESS_CODE");
  return value;
}

export function accessToken() {
  const secret = process.env.ORDER_COOKIE_SECRET;
  if (!secret) throw new Error("Falta ORDER_COOKIE_SECRET");
  return createHash("sha256").update(`tubio-order-v2:${secret}`).digest("hex");
}
