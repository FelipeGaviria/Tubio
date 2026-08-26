import { createHash } from "node:crypto";

export const SOCIAL_COOKIE = "tubio_social_access";
export const socialAccessCode = () => process.env.SOCIAL_ACCESS_CODE ?? "5403";
export const socialAccessToken = () => createHash("sha256").update(`tubio-social:${process.env.SOCIAL_COOKIE_SECRET ?? socialAccessCode()}`).digest("hex");
