import { cookies } from "next/headers";
import { clubCookieName, isClubGate } from "@/lib/club-access";

const endpoints = {
  attendance: "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/attendance-sync",
  rotaract: "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/rotaract-sync",
};

type ClubRouteContext = { params: Promise<{ club: string }> };

async function target(context: ClubRouteContext) {
  const { club } = await context.params;
  if (!isClubGate(club)) return null;
  const token = (await cookies()).get(clubCookieName(club))?.value;
  return token ? { url: endpoints[club], token } : null;
}

async function publicTarget(context: ClubRouteContext) {
  const { club } = await context.params;
  return isClubGate(club) ? { club, url: endpoints[club] } : null;
}

export async function GET(_request: Request, context: ClubRouteContext) {
  const destination = await publicTarget(context);
  if (!destination) return Response.json({ error: "Club inválido" }, { status: 404 });
  const access = await target(context);
  const response = await fetch(destination.url, { headers: access ? { Authorization: `Bearer ${access.token}` } : undefined, cache: "no-store" });
  return new Response(await response.text(), { status: response.status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export async function POST(request: Request, context: ClubRouteContext) {
  const access = await target(context);
  if (!access) return Response.json({ error: "Acceso denegado" }, { status: 401 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 1_000_000) return Response.json({ error: "Datos demasiado grandes" }, { status: 413 });
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > 1_000_000) return Response.json({ error: "Datos demasiado grandes" }, { status: 413 });
  const response = await fetch(access.url, { method: "POST", headers: { Authorization: `Bearer ${access.token}`, "content-type": "application/json" }, body, cache: "no-store" });
  return new Response(await response.text(), { status: response.status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
