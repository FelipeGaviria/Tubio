import type { Metadata } from "next";
import { AttendanceApp } from "@/components/AttendanceApp";

export const metadata: Metadata = {
  title: "Asistencia a Sesiones",
  description: "Registro sencillo de asistencia para las sesiones de Toastmasters.",
};

export default function AttendancePage() {
  return <AttendanceApp />;
}