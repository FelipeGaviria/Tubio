import { checkPrivateAccess } from "@/lib/check-private-access";
import { NextResponse } from "next/server";
import { CLUB_ACCESS_MAX_AGE, clubCookieName, isClubGate } from "@/lib/club-access";

export async function POST(request: Request) {
  let body: { gate?: unknown; code?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "Solicitud inválida" }, { status: 400 }); }
  if (typeof body.gate !== "string" || typeof body.code !== "string") return Response.json({ error: "Solicitud inválida" }, { status: 400 });

  const { response, result } = await checkPrivateAccess(request, body.gate, body.code);
  const token = "token" in result ? result.token : undefined;
  const publicResult = { ...result };
  if ("token" in publicResult) delete publicResult.token;
  const nextResponse = NextResponse.json(publicResult, { status: response.status });
  if (response.ok && token && isClubGate(body.gate)) {
    nextResponse.cookies.set(clubCookieName(body.gate), token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/api/club-sync",
      maxAge: CLUB_ACCESS_MAX_AGE,
      priority: "high",
    });
  }
  return nextResponse;
}
