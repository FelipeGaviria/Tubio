import { checkPrivateAccess } from "@/lib/check-private-access";

export async function POST(request: Request) {
  let body: { gate?: unknown; code?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "Solicitud inválida" }, { status: 400 }); }
  if (typeof body.gate !== "string" || typeof body.code !== "string") return Response.json({ error: "Solicitud inválida" }, { status: 400 });

  const { response, result } = await checkPrivateAccess(request, body.gate, body.code);
  return Response.json(result, { status: response.status });
}
