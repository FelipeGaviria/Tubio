const TRM_ENDPOINT = "https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC";
const FALLBACK_TRM = 3081.67;

type TrmRow = { valor?: string; vigenciadesde?: string };

export async function GET() {
  try {
    const response = await fetch(TRM_ENDPOINT, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("TRM source unavailable");

    const rows = await response.json() as TrmRow[];
    const value = Number(rows[0]?.valor);
    if (!Number.isFinite(value) || value <= 0) throw new Error("Invalid TRM");

    const date = rows[0]?.vigenciadesde ? new Date(`${rows[0].vigenciadesde.slice(0, 10)}T12:00:00-05:00`) : new Date();
    return Response.json({
      value,
      date: rows[0]?.vigenciadesde?.slice(0, 10),
      dateLabel: date.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Bogota" }),
      source: "Superintendencia Financiera de Colombia",
    });
  } catch {
    return Response.json({ value: FALLBACK_TRM, dateLabel: "última referencia disponible", source: "fallback" });
  }
}
