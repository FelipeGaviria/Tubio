import type { Metadata, Viewport } from "next";
import { RotaractApp } from "@/components/RotaractApp";

export const metadata: Metadata = {
  applicationName: "Rotaract Nuevo Medellín",
  manifest: "/icons/rotaract/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Rotaract", statusBarStyle: "default" },
  title: "Rotaract Nuevo Medellín",
  description: "Calendario y asistencia compartida de Rotaract Nuevo Medellín.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f6f7fc" };

export default function RotaractPage() {
  return <RotaractApp />;
}
