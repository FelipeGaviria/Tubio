import { NextResponse } from "next/server";

import { accessCode, accessToken, ORDER_COOKIE } from "@/lib/order-access";
import { checkPrivateAccess } from "@/lib/check-private-access";

export async function POST(request: Request) {
  let submitted = "";
  try {
    const body = await request.json() as { code?: unknown };
    submitted = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const access = await checkPrivateAccess(request, "order", submitted);
  if (!access.response.ok || submitted !== accessCode()) return NextResponse.json(access.result, { status: access.response.status });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ORDER_COOKIE, accessToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/orden",
    maxAge: 60 * 60 * 2,
  });
  return response;
}
