import type { Metadata } from "next";
import { AttendanceApp } from "@/components/AttendanceApp";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Asistencia a Sesiones",
  description: "Registro sencillo de asistencia para las sesiones de Toastmasters.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function AttendancePage() {
  return <AttendanceApp />;
}
