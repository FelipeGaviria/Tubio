"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Card = { id: string; front: string; back: string };
const cards: Card[] = [
  { id: "t1", front: "/images/portfolio/tarjetas/t1.png", back: "/images/portfolio/tarjetas/t1-anverso.png" },
  { id: "t2", front: "/images/portfolio/tarjetas/t2.png", back: "/images/portfolio/tarjetas/t2-anverso.png" },
  { id: "t3", front: "/images/portfolio/tarjetas/t3.png", back: "/images/portfolio/tarjetas/t3-anverso.png" },
  { id: "t4", front: "/images/portfolio/tarjetas/t4.png", back: "/images/portfolio/tarjetas/t4-anverso.png" },
  { id: "t5", front: "/images/portfolio/tarjetas/t5.png", back: "/images/portfolio/tarjetas/t5-anverso.png" },
  { id: "t6", front: "/images/portfolio/tarjetas/t6.png", back: "/images/portfolio/tarjetas/t6-anverso.png" },
  { id: "t7", front: "/images/portfolio/tarjetas/t7.png", back: "/images/portfolio/tarjetas/t7-anverso.png" },
];

export default function NfcCardCarousel() {
  const [flipped, setFlipped] = useState<string[]>([]);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = window.setInterval(() => { const element = track.current; if (!element) return; const step = Math.min(616, element.clientWidth * 1.48); if (element.scrollLeft >= element.scrollWidth / 2 - step) { element.scrollTo({ left: 0 }); window.setTimeout(() => element.scrollBy({ left: step, behavior: "smooth" }), 40); } else element.scrollBy({ left: step, behavior: "smooth" }); }, 3600); return () => window.clearInterval(timer); }, []);
  const toggle = (id: string) => setFlipped((current) => current.includes(id) ? current.filter((card) => card !== id) : [...current, id]);
  return <section className="raw-nfc-cards"><div className="raw-nfc-heading"><p className="raw-label">Tarjetas digitales</p><p>Haz clic o pasa el cursor para ver el reverso.</p></div><div className="raw-nfc-viewport" ref={track}><div className="raw-nfc-track">{[0, 1].map((copy) => <div className="raw-nfc-set" key={copy}>{cards.map((card) => <button type="button" key={card.id} className={`raw-nfc-card ${flipped.includes(card.id) ? "is-flipped" : ""}`} onClick={() => toggle(card.id)} aria-label={`Girar tarjeta ${card.id.toUpperCase()}`} aria-pressed={flipped.includes(card.id)}><span className="raw-nfc-card-inner"><span className="raw-nfc-card-face raw-nfc-card-front"><Image src={card.front} alt={`Tarjeta ${card.id.toUpperCase()}, frente`} fill sizes="(max-width: 800px) 72vw, 290px" /></span><span className="raw-nfc-card-face raw-nfc-card-back"><Image src={card.back} alt={`Tarjeta ${card.id.toUpperCase()}, reverso`} fill sizes="(max-width: 800px) 72vw, 290px" /></span></span></button>)}</div>)}</div></div></section>;
}