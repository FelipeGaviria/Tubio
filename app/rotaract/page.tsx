import type { Metadata, Viewport } from "next";
import { RotaractApp } from "@/components/RotaractApp";

export const metadata: Metadata = {
  title: "Rotaract Nuevo Medellín",
  description: "Calendario y asistencia compartida de Rotaract Nuevo Medellín.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RotaractPage() {
  return <RotaractApp />;
}
