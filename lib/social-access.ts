import { createHash } from "node:crypto";

export const SOCIAL_COOKIE = "tubio_social_access";
export const socialAccessCode = () => {
  return process.env.SOCIAL_ACCESS_CODE ?? process.env.ORDER_ACCESS_CODE ?? "5403";
};
export const socialAccessToken = () => {
  const secret = process.env.SOCIAL_COOKIE_SECRET ?? process.env.ORDER_COOKIE_SECRET ?? `social:${socialAccessCode()}`;
  return createHash("sha256").update(`tubio-social:${secret}`).digest("hex");
};
