import type { Metadata } from "next";
import { AttendanceApp } from "@/components/AttendanceApp";

export const metadata: Metadata = {
  title: "Acompañamiento de asistencias",
  description: "Registro sencillo de asistencia para las sesiones de Toastmasters.",
};

export default function AttendancePage() {
  return <AttendanceApp />;
}