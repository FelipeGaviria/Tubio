import { createHash } from "node:crypto";

export const SOCIAL_COOKIE = "tubio_social_access";
export const socialAccessCode = () => {
  const value = process.env.SOCIAL_ACCESS_CODE ?? process.env.ORDER_ACCESS_CODE;
  if (!value) throw new Error("Falta SOCIAL_ACCESS_CODE");
  return value;
};
export const socialAccessToken = () => {
  const secret = process.env.SOCIAL_COOKIE_SECRET ?? process.env.ORDER_COOKIE_SECRET;
  if (!secret) throw new Error("Falta SOCIAL_COOKIE_SECRET");
  return createHash("sha256").update(`tubio-social:${secret}`).digest("hex");
};
