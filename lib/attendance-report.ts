import { jsPDF } from "jspdf";

export type AttendanceReport = {
  club: "toastmasters" | "rotaract";
  title: string;
  date: string;
  meetingLabel: string;
  held: boolean;
  syncPending: boolean;
  people: { name: string; role: string; mark?: string }[];
};

const labels: Record<string, string> = {
  present: "Presencial", virtual: "Virtual",
};

export function createAttendanceReport(report: AttendanceReport, logo?: string) {
  const attendees = report.people.filter((person) => person.mark === "present" || person.mark === "virtual");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const accent = report.club === "rotaract" ? "#d41367" : "#77213f";
  const formattedDate = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${report.date}T12:00:00`));
  pdf.setProperties({ title: `${report.title} - Asistencia ${report.date}`, subject: "Resumen de asistencia de la reunión", author: report.title });
  let y = 0;
  const text = (value: string, x: number, top: number, size = 10, bold = false, color = "#26344a") => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(color);
    pdf.text(value, x, top);
  };
  function heading(continued = false) {
    pdf.setFillColor(accent);
    pdf.rect(0, 0, 210, 5, "F");
    if (logo) pdf.addImage(logo, "PNG", 172, 15, 22, 22);
    text(report.title, 16, 22, 16, true);
    text(continued ? "Resumen de asistencia · continuación" : "Resumen de asistencia", 16, 31, 11);
    text(`Fecha de reunión: ${formattedDate}`, 16, 41, 10, true);
    text(report.meetingLabel, 16, 48, 10);
    y = 58;
  }
  function tableHeading() {
    pdf.setFillColor("#edf0f5");
    pdf.rect(16, y, 178, 9, "F");
    text("Nombre", 19, y + 6, 9, true);
    text("Participación", 113, y + 6, 9, true);
    text("Asistencia", 157, y + 6, 9, true);
    y += 12;
  }
  function nextPage() { pdf.addPage(); heading(true); tableHeading(); }
  heading();
  if (report.syncPending) {
    text("Copia local: hay cambios pendientes de sincronización.", 16, y, 9, true, "#875012");
    y += 9;
  }
  if (!report.held) {
    text("No hubo reunión. Esta fecha no suma asistencias ni ausencias.", 16, y, 10);
  } else {
    const totals = Object.keys(labels).map((mark) => `${labels[mark]}: ${attendees.filter((person) => person.mark === mark).length}`);
    text(`Asistentes: ${attendees.length}`, 16, y, 11, true);
    y += 8;
    pdf.setFontSize(9);
    const summary = pdf.splitTextToSize(totals.join("   |   "), 178) as string[];
    summary.forEach((line) => { text(line, 16, y, 9); y += 5; });
    y += 5;
    tableHeading();
    if (!attendees.length) text("No hay asistencias registradas para esta fecha.", 19, y + 5);
    for (const person of attendees) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const nameLines = pdf.splitTextToSize(person.name, 88) as string[];
      const roleLines = pdf.splitTextToSize(person.role, 38) as string[];
      const statusLines = pdf.splitTextToSize(labels[person.mark ?? "pending"] ?? "Sin registrar", 34) as string[];
      const lineCount = Math.max(nameLines.length, roleLines.length, statusLines.length);
      if (y + Math.min(lineCount * 5 + 5, 200) > 274) nextPage();
      for (let i = 0; i < lineCount; i++) {
        if (y + 6 > 274) nextPage();
        if (nameLines[i]) text(nameLines[i], 19, y + 4, 10);
        if (roleLines[i]) text(roleLines[i], 113, y + 4, 9);
        if (statusLines[i]) text(statusLines[i], 157, y + 4, 9);
        y += 5;
      }
      y += 4;
      pdf.setDrawColor("#e3e7ed");
      pdf.line(16, y - 1, 194, y - 1);
    }
  }
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    text(`${report.title} · ${report.date}`, 16, 286, 8, false, "#657084");
    text(`${i} / ${totalPages}`, 178, 286, 8, false, "#657084");
  }
  return pdf;
}
