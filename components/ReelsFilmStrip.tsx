"use client";

import { useEffect, useRef } from "react";

const placeholders = ["Reel 01", "Reel 02", "Reel 03", "Reel 04", "Reel 05"];

export default function ReelsFilmStrip() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = window.setInterval(() => { const element = track.current; if (!element) return; const frame = element.querySelector<HTMLElement>(".raw-film-frame"); const step = ((frame?.offsetWidth ?? 260) + 18) * 2; if (element.scrollLeft + element.clientWidth >= element.scrollWidth - step) element.scrollTo({ left: 0, behavior: "smooth" }); else element.scrollBy({ left: step, behavior: "smooth" }); }, 4400); return () => window.clearInterval(timer); }, []);
  return <section className="raw-reels"><div className="raw-reels-heading"><p className="raw-label">Próximamente</p><h3>REELS</h3></div><div className="raw-film-viewport"><div className="raw-film-track" ref={track}>{placeholders.map((title, index) => <article className="raw-film-frame" key={title}><div className="raw-film-perforations" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="raw-film-image"><span>{String(index + 1).padStart(2, "0")}</span><b>VIDEO<br />PRÓXIMAMENTE</b></div><div className="raw-film-caption"><small>{title}</small><span>▶</span></div><div className="raw-film-perforations" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></article>)}</div></div><p className="raw-reels-note">Los enlaces estarán disponibles aquí.</p></section>;
}