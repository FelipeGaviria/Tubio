"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };
type BrandCase = { name: string; intro: string; slides: Slide[] };

const cases: BrandCase[] = [
  { name: "Identidad 4271", intro: "Una identidad trabajada como sistema: investigación, criterio visual y reglas claras para que cada aplicación mantenga la misma voz.", slides: [1, 2, 3, 4, 5, 6].map((number) => ({ src: `/images/portfolio/manuales/identidad-4271-manual${number}.png`, alt: `Manual de Identidad 4271, lámina ${number}` })) },
  { name: "Quilla", intro: "Una marca construida desde el entendimiento de su contexto, traducida en códigos visuales que se reconocen, se recuerdan y se pueden aplicar.", slides: [1, 2, 3, 4].map((number) => ({ src: `/images/portfolio/manuales/quilla${number}.png`, alt: `Manual Quilla, lámina ${number}` })) },
  { name: "RiBuzz", intro: "Un sistema vivo para una marca digital: lenguaje, consistencia y herramientas visuales pensadas para crecer con el equipo.", slides: ["", "2", "3", "4", "5"].map((suffix, index) => ({ src: `/images/portfolio/manuales/ribuzz${suffix}.png`, alt: `Manual RiBuzz, lámina ${index + 1}` })) },
];

function ManualSlide({ slide, className, sizes, priority = false }: { slide: Slide; className?: string; sizes: string; priority?: boolean }) {
  const [selected, setSelected] = useState<Slide | null>(null);
  useEffect(() => { if (!selected) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [selected]);
  return <><button type="button" className={`raw-manual-slide ${className ?? ""}`} onClick={() => setSelected(slide)} aria-label={`Ampliar ${slide.alt}`}><Image src={slide.src} alt={slide.alt} fill sizes={sizes} priority={priority} /></button>{selected && <button type="button" className="raw-illustration-modal" onClick={() => setSelected(null)} aria-label="Cerrar manual ampliado"><Image src={selected.src} alt={selected.alt} fill sizes="100vw" priority /></button>}</>;
}

export default function ManualCases() {
  return <section id="manuales" className="raw-manuals"><div className="raw-manuals-heading"><div><p className="raw-label">08 / Manuales de marca</p><h2>Identidades que<br /><em>se sostienen.</em></h2></div><p>La identidad no termina en un logo. Cada manual reúne investigación, entendimiento del contexto y un sistema visual preparado para aplicarse con claridad y consistencia.</p></div><div className="raw-manual-cases">{cases.map((brandCase, index) => <article className="raw-manual-case" key={brandCase.name}><div className="raw-manual-case-intro"><p className="raw-label">Caso 0{index + 1}</p><h3>{brandCase.name}</h3><p>{brandCase.intro}</p><ol><li>Investigación</li><li>Entendimiento</li><li>Sistema visual</li><li>Aplicación</li></ol></div><ManualSlide slide={brandCase.slides[0]} className="raw-manual-cover" sizes="(max-width: 800px) 100vw, 62vw" priority={index === 0} /><div className="raw-manual-thumbnails">{brandCase.slides.slice(1).map((slide) => <ManualSlide key={slide.src} slide={slide} sizes="(max-width: 800px) 100vw, 30vw" />)}</div></article>)}</div></section>;
}