import { NextResponse } from "next/server";

import { accessCode, accessToken, ORDER_COOKIE } from "@/lib/order-access";

export async function POST(request: Request) {
  let submitted = "";
  try {
    const body = await request.json() as { code?: unknown };
    submitted = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (submitted !== accessCode()) return NextResponse.json({ ok: false }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ORDER_COOKIE, accessToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/orden",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
