import type { Metadata } from "next";
import { AttendanceApp } from "@/components/AttendanceApp";
import type { Viewport } from "next";

export const metadata: Metadata = {
  applicationName: "Toastmasters",
  manifest: "/icons/toastmasters/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Toastmasters", statusBarStyle: "default" },
  title: "Asistencia a Sesiones",
  description: "Registro sencillo de asistencia para las sesiones de Toastmasters.",
  openGraph: {
    title: "Sesiones Toast Medellín",
    description: "Asistencia, agenda, muletillas y palabras de las sesiones de Toastmasters Medellín.",
    type: "website",
    images: [{ url: "/images/clubs/toastmasters-logo.png", alt: "Toastmasters Medellín" }],
  },
  twitter: {
    card: "summary",
    title: "Sesiones Toast Medellín",
    description: "Asistencia, agenda, muletillas y palabras de las sesiones.",
    images: ["/images/clubs/toastmasters-logo.png"],
  },
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
