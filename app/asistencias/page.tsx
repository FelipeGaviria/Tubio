import type { Metadata } from "next";
import { AttendanceApp } from "@/components/AttendanceApp";
import type { Viewport } from "next";

export const metadata: Metadata = {
  applicationName: "Toastmasters",
  manifest: "/icons/toastmasters/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Toastmasters", statusBarStyle: "default" },
  title: "Asistencia a Sesiones",
  description: "Registro sencillo de asistencia para las sesiones de Toastmasters.",
};

export const viewport: Viewport = {
  themeColor: "#14274d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function AttendancePage() {
  return <AttendanceApp />;
}
