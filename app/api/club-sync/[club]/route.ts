import { cookies } from "next/headers";
import { clubCookieName } from "@/lib/club-access";
import { checkPrivateAccess } from "@/lib/check-private-access";

const endpoints = {
  attendance: "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/attendance-sync",
  rotaract: "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/rotaract-sync",
};

type ClubRouteContext = { params: Promise<{ club: string }> };
let attendanceViewerToken = "";

async function target(context: ClubRouteContext, editing = false) {
  const { club } = await context.params;
  if (club !== "attendance" && club !== "rotaract") return null;
  const gate = club === "attendance" && editing ? "attendance-edit" : club;
  const token = (await cookies()).get(clubCookieName(gate))?.value;
  return token ? { url: endpoints[club], token } : null;
}

async function publicTarget(context: ClubRouteContext) {
  const { club } = await context.params;
  return club === "attendance" || club === "rotaract" ? { club, url: endpoints[club] } : null;
}

export async function GET(_request: Request, context: ClubRouteContext) {
  const destination = await publicTarget(context);
  if (!destination) return Response.json({ error: "Club inválido" }, { status: 404 });
  let access = await target(context);
  if (!access && destination.club === "attendance") {
    if (!attendanceViewerToken) {
      const validation = await checkPrivateAccess(_request, "attendance", process.env.ATTENDANCE_VIEW_CODE ?? "1234");
      if (validation.response.ok && "token" in validation.result && validation.result.token) attendanceViewerToken = validation.result.token;
    }
    if (attendanceViewerToken) access = { url: destination.url, token: attendanceViewerToken };
  }
  if (!access && destination.club === "attendance") return Response.json({ error: "No fue posible consultar el club" }, { status: 503 });
  const response = await fetch(destination.url, { headers: access ? { Authorization: `Bearer ${access.token}` } : undefined, cache: "no-store" });
  if (response.status === 401 && destination.club === "attendance") attendanceViewerToken = "";
  return new Response(await response.text(), { status: response.status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export async function POST(request: Request, context: ClubRouteContext) {
  const access = await target(context, true);
  if (!access) return Response.json({ error: "Acceso denegado" }, { status: 401 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 1_000_000) return Response.json({ error: "Datos demasiado grandes" }, { status: 413 });
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > 1_000_000) return Response.json({ error: "Datos demasiado grandes" }, { status: 413 });
  const response = await fetch(access.url, { method: "POST", headers: { Authorization: `Bearer ${access.token}`, "content-type": "application/json" }, body, cache: "no-store" });
  return new Response(await response.text(), { status: response.status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
