"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  ["Mi trabajo", "Una colección de proyectos, ideas y colaboraciones.", "#trabajo"],
  ["Agenda una llamada", "Hablemos de tu próxima idea.", "mailto:hola@tubio.co"],
  ["Instagram", "Proceso, referencias y vida creativa.", "https://instagram.com"],
];

export default function TemplateFourPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const onScroll = () => setScrollY(window.scrollY); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <main className="template-four-shell">
    <div className="template-four-scene" aria-hidden="true"><div className="template-four-sun" style={{ transform: `translateY(${scrollY * 0.12}px)` }} /><div className="template-four-ring" style={{ transform: `rotate(${scrollY * 0.035}deg) translateY(${scrollY * -0.08}px)` }} /><div className="template-four-grain" /></div>
    <header className="template-four-header"><Link href="/">TuBio / Template 4</Link><span>Parallax biolink</span></header>
    <section className="template-four-hero">
      <div className="template-four-avatar" style={{ transform: `translateY(${scrollY * -0.08}px)` }}><span>AM</span></div>
      <p className="template-four-kicker">Creative director / Bogotá</p><h1>Andrea<br /><em>Márquez</em></h1><p className="template-four-bio">Construyo identidades, experiencias y momentos digitales para marcas que quieren moverse distinto.</p>
      <div className="template-four-socials"><a href="https://instagram.com">IG</a><a href="mailto:hola@tubio.co">@</a><a href="#trabajo">↓</a></div>
    </section>
    <section id="trabajo" className="template-four-links"><p className="template-four-kicker">Encuentra tu próximo paso</p>{links.map(([title, body, href], index) => <a href={href} key={title} className="template-four-link" style={{ transform: `translateY(${Math.max(0, 80 - scrollY * 0.16 - index * 12)}px)` }}><span>0{index + 1}</span><div><strong>{title}</strong><small>{body}</small></div><b>↗</b></a>)}</section>
    <section className="template-four-note"><p>&ldquo;La mejor tarjeta digital no solo informa. Deja una sensación.&rdquo;</p><span>— Andrea</span></section>
    <footer className="template-four-footer"><span>Template 4 / biolink parallax</span><Link href="/">Ver landings</Link></footer>
  </main>;
}
