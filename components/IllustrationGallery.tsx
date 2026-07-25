"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Illustration = {
  src: string;
  alt: string;
};

const shift: Illustration[] = [
  { src: "/images/portfolio/illustrations/shift-01.png", alt: "Ilustración Shift" },
  { src: "/images/portfolio/illustrations/shift-expansion-01.png", alt: "Ilustración Shift Expansion" },
  { src: "/images/portfolio/illustrations/shift-expansion-02.png", alt: "Ilustración Shift Expansion 2" },
];

const projects: Illustration[] = [
  { src: "/images/portfolio/illustrations/proyecto-02.png", alt: "Ilustración Proyecto 2" },
  { src: "/images/portfolio/illustrations/proyecto-03.png", alt: "Ilustración Proyecto 3" },
  { src: "/images/portfolio/illustrations/proyecto-04.png", alt: "Ilustración Proyecto 4" },
];

function IllustrationTrigger({ illustration, className, sizes, priority = false }: { illustration: Illustration; className?: string; sizes: string; priority?: boolean }) {
  const [selected, setSelected] = useState<Illustration | null>(null);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  return <><button type="button" className={`raw-illustration-trigger ${className ?? ""}`} onClick={() => setSelected(illustration)} aria-label={`Ampliar ${illustration.alt}`}><Image src={illustration.src} alt={illustration.alt} fill sizes={sizes} priority={priority} /></button>{selected && <button type="button" className="raw-illustration-modal" onClick={() => setSelected(null)} aria-label="Cerrar ilustración ampliada"><Image src={selected.src} alt={selected.alt} fill sizes="100vw" priority /></button>}</>;
}

export default function IllustrationGallery() {
  return <section id="ilustraciones" className="raw-illustrations"><div className="raw-illustrations-heading"><div><p className="raw-label">07 / Ilustración</p><h2>Ilustración.</h2></div><p>Trabajo con múltiples estilos y formatos, adaptando cada propuesta a las necesidades de cada cliente. Experiencia en producción de piezas en volumen y colaboración fluida con equipos creativos.</p></div><article className="raw-illustration-series raw-illustration-series-shift"><div className="raw-series-copy"><h3>Shift.</h3></div><IllustrationTrigger illustration={shift[0]} className="raw-illustration-feature" sizes="(max-width: 800px) 100vw, 58vw" priority /></article><div className="raw-illustration-pair"><div className="raw-illustration-pair-grid"><IllustrationTrigger illustration={shift[1]} sizes="(max-width: 800px) 100vw, 29vw" /><IllustrationTrigger illustration={shift[2]} sizes="(max-width: 800px) 100vw, 29vw" /></div></div><div className="raw-illustration-project-grid">{projects.map((illustration) => <IllustrationTrigger key={illustration.src} illustration={illustration} sizes="(max-width: 800px) 100vw, 31vw" />)}</div><div className="raw-illustrations-more"><a href="https://www.behance.net/fegav" target="_blank" rel="noreferrer">Ver más <span>↗</span></a></div></section>;
}