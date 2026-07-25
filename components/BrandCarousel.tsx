"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type BrandPiece = { brand: string; src: string; alt: string; format?: "wide" };

const pieces: BrandPiece[] = [
  { brand: "El Burro", src: "/images/portfolio/marcas/burro-banner.png", alt: "El Burro, banner", format: "wide" },
  { brand: "El Burro", src: "/images/portfolio/marcas/burro1.png", alt: "El Burro, pieza 1" },
  { brand: "El Burro", src: "/images/portfolio/marcas/burro2.png", alt: "El Burro, pieza 2" },
  { brand: "Consultora", src: "/images/portfolio/marcas/consultora1.png", alt: "Consultora, pieza 1" },
  { brand: "Consultora", src: "/images/portfolio/marcas/consultora2.png", alt: "Consultora, pieza 2" },
  { brand: "Tersa", src: "/images/portfolio/marcas/marca-tersa.png", alt: "Marca Tersa" },
  { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz1.png", alt: "RiBuzz, pieza 1" },
  { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz2.png", alt: "RiBuzz, pieza 2" },
  { brand: "Rotary", src: "/images/portfolio/marcas/rotary.png", alt: "Rotary, pieza 1" },
  { brand: "Rotary", src: "/images/portfolio/marcas/rotary2.png", alt: "Rotary, pieza 2", format: "wide" },
  { brand: "San Juan", src: "/images/portfolio/marcas/san-juan.png", alt: "San Juan, banner", format: "wide" },
  { brand: "Valorum", src: "/images/portfolio/marcas/valorum1.png", alt: "Valorum, pieza 1" },
  { brand: "Valorum", src: "/images/portfolio/marcas/valorum2.png", alt: "Valorum, pieza 2" },
];

export default function BrandCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<BrandPiece | null>(null);
  const move = (direction: number) => track.current?.scrollBy({ left: direction * Math.max(track.current.clientWidth * .78, 320), behavior: "smooth" });
  return <div className="raw-brand-carousel"><div className="raw-brand-carousel-top"><p>Diseños, campañas y sistemas visuales para marcas con contextos distintos.</p><div><button type="button" onClick={() => move(-1)} aria-label="Ver trabajos anteriores">←</button><button type="button" onClick={() => move(1)} aria-label="Ver más trabajos">→</button></div></div><div className="raw-brand-track" ref={track}>{pieces.map((piece) => <button type="button" className={`raw-brand-piece ${piece.format === "wide" ? "raw-brand-piece-wide" : ""}`} key={piece.src} onClick={() => setSelected(piece)} aria-label={`Ampliar ${piece.alt}`}><Image src={piece.src} alt={piece.alt} fill sizes="(max-width: 800px) 72vw, 27vw" /><span>{piece.brand}</span></button>)}</div>{selected && <button type="button" className="raw-illustration-modal" onClick={() => setSelected(null)} aria-label="Cerrar diseño ampliado"><Image src={selected.src} alt={selected.alt} fill sizes="100vw" priority /></button>}</div>;
}