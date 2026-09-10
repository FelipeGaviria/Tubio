"use client";

import { useState } from "react";
import type { AttendanceReport } from "@/lib/attendance-report";

export function AttendanceReportButton({ report }: { report: AttendanceReport }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function download() {
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const { createAttendanceReport } = await import("@/lib/attendance-report");
      let logo: string | undefined;
      try {
        const response = await fetch(`/icons/${report.club}/icon-192.png`);
        if (response.ok) {
          const blob = await response.blob();
          logo = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      } catch { /* El resumen también puede generarse sin el logo. */ }
      const pdf = createAttendanceReport(report, logo);
      pdf.save(`${report.club}-asistencia-${report.date}.pdf`);
    } catch { setError(true); }
    finally { setBusy(false); }
  }
  return <div className="club-report-action">
    <button type="button" onClick={() => void download()} disabled={busy}>
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7Z"/><path d="M17 11h.01"/></svg>
      {busy ? "Generando PDF…" : report.club === "rotaract" ? "Generar PDF" : "Imprimir resumen"}
    </button>
    <small role={error ? "alert" : undefined}>{error ? "No se pudo generar el PDF. Inténtalo de nuevo." : "Descarga el PDF de esta reunión para guardarlo o imprimirlo."}</small>
  </div>;
}
