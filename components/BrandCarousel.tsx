"use client";

import Image from "next/image";
import NfcCardCarousel from "@/components/NfcCardCarousel";
import { useEffect, useRef, useState } from "react";

type BrandPiece = { brand: string; src: string; alt: string };

const verticalPieces: BrandPiece[] = [
  { brand: "Burro Pizzería", src: "/images/portfolio/marcas/burro1.png", alt: "El Burro, pieza 1" }, { brand: "Burro Pizzería", src: "/images/portfolio/marcas/burro2.png", alt: "El Burro, pieza 2" },
  { brand: "Consultora", src: "/images/portfolio/marcas/consultora1.png", alt: "Consultora, pieza 1" }, { brand: "Consultora", src: "/images/portfolio/marcas/consultora2.png", alt: "Consultora, pieza 2" }, { brand: "Consultora", src: "/images/portfolio/marcas/consultora3.png", alt: "Consultora, pieza 3" },
  { brand: "Tersa", src: "/images/portfolio/marcas/marca-tersa.png", alt: "Marca Tersa" }, { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz1.png", alt: "RiBuzz, pieza 1" }, { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz2.png", alt: "RiBuzz, pieza 2" }, { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz3.png", alt: "RiBuzz, pieza 3" }, { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz4.png", alt: "RiBuzz, pieza 4" }, { brand: "RiBuzz", src: "/images/portfolio/marcas/ribuzz5.png", alt: "RiBuzz, pieza 5" },
  { brand: "Rotary", src: "/images/portfolio/marcas/rotary.png", alt: "Rotary, pieza 1" }, { brand: "Valorum", src: "/images/portfolio/marcas/valorum1.png", alt: "Valorum, pieza 1" }, { brand: "Valorum", src: "/images/portfolio/marcas/valorum2.png", alt: "Valorum, pieza 2" },
];
const widePieces: BrandPiece[] = [{ brand: "Burro Pizzería", src: "/images/portfolio/marcas/burro-banner.png", alt: "El Burro, banner" }, { brand: "Rotary", src: "/images/portfolio/marcas/rotary2.png", alt: "Rotary, campaña" }, { brand: "San Juan", src: "/images/portfolio/marcas/san-juan.png", alt: "San Juan, banner" }];

function Piece({ piece, onOpen, wide = false }: { piece: BrandPiece; onOpen: (piece: BrandPiece) => void; wide?: boolean }) { return <button type="button" className={`raw-brand-piece ${wide ? "raw-brand-piece-wide" : ""}`} onClick={() => onOpen(piece)} aria-label={`Ampliar ${piece.alt}`}><Image src={piece.src} alt={piece.alt} fill sizes="(max-width: 800px) 72vw, 27vw" /><span>{piece.brand}</span></button>; }

export default function BrandCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<BrandPiece | null>(null);
  const [shuffledPieces, setShuffledPieces] = useState(verticalPieces);
  const move = (direction: number) => track.current?.scrollBy({ left: direction * Math.max(track.current.clientWidth * .42, 240), behavior: "smooth" });
  useEffect(() => { const mixed = [...verticalPieces]; for (let index = mixed.length - 1; index > 0; index -= 1) { const swap = Math.floor(Math.random() * (index + 1)); [mixed[index], mixed[swap]] = [mixed[swap], mixed[index]]; } setShuffledPieces(mixed); }, []);
  useEffect(() => { const timer = window.setInterval(() => { const element = track.current; if (!element) return; const next = Math.max(element.clientWidth * .42, 240); if (element.scrollLeft + element.clientWidth >= element.scrollWidth - 12) element.scrollTo({ left: 0, behavior: "smooth" }); else element.scrollBy({ left: next, behavior: "smooth" }); }, 6500); return () => window.clearInterval(timer); }, []);
  return <div className="raw-brand-carousel"><div className="raw-brand-carousel-top"><div><p className="raw-label">Marcas con las que he trabajado</p></div><div><button type="button" onClick={() => move(-1)} aria-label="Ver trabajos anteriores">←</button><button type="button" onClick={() => move(1)} aria-label="Ver más trabajos">→</button></div></div><div className="raw-brand-track" ref={track}>{shuffledPieces.map((piece) => <Piece key={piece.src} piece={piece} onOpen={setSelected} />)}</div><div className="raw-brand-wide"><p className="raw-label">Formatos panorámicos</p><div>{widePieces.map((piece) => <Piece key={piece.src} piece={piece} onOpen={setSelected} wide />)}</div></div><NfcCardCarousel />{selected && <button type="button" className="raw-illustration-modal" onClick={() => setSelected(null)} aria-label="Cerrar diseño ampliado"><Image src={selected.src} alt={selected.alt} fill sizes="100vw" priority /></button>}</div>;
}