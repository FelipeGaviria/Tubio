import type { Metadata } from "next";
import TemplateTwoClient from "./template-two-client";

export const metadata: Metadata = {
  title: 'Tarjeta digital profesional | Template 2',
  description: 'Una tarjeta digital profesional para compartir tu contacto, redes sociales y servicios desde un solo enlace.',
  keywords: ['tarjeta digital', 'tarjeta de presentación digital', 'landing profesional', 'TuBio', 'contacto digital'],
  openGraph: {
    title: 'Tarjeta digital profesional | TuBio',
    description: 'Comparte tu información profesional, redes y contacto desde una experiencia digital elegante.',
    type: 'website',
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary',
    title: 'Tarjeta digital profesional | TuBio',
    description: 'Comparte tu información profesional desde un solo enlace.',
  },
};

export default function TemplateTwoPage() {
  return <TemplateTwoClient />;
}
