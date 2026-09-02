"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

const InstagramIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" className="fill"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>;
const WhatsAppIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8.4 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 2c.1.3 0 .5-.2.7l-.7.8c-.2.2-.1.4 0 .6.8 1.4 1.9 2.5 3.4 3.1.3.1.5.1.7-.1l.9-1.1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.6 0 .4-.2 1.4-.9 2-.6.6-1.5.8-2.5.6-1-.2-2.3-.7-3.9-1.7-2.8-1.8-4.6-4.6-5.1-6.3-.5-1.6.2-2.5.8-2.9"/></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4m8-4v4M3 10h18"/></svg>;
const ShareIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/></svg>;
const SealIcon = () => <svg viewBox="0 0 150 100" aria-hidden="true"><path d="M30 60c-9-9-14-21-9-27 4-5 13 1 22 9 8-16 25-27 48-25 26 2 42 18 39 37-3 17-23 30-49 29-10 0-19-2-26-6-8 7-21 11-29 7-6-3-3-14 4-24Z"/><path d="M119 39c9-7 16-7 18-2 2 6-5 12-13 14M55 74c-4 10-12 15-19 13M69 78c0 9 6 15 13 16"/><circle cx="105" cy="36" r="2" className="seal-eye"/><path d="M112 43c4 2 7 2 10 0M117 41l8-4m-7 7 9 2"/></svg>;

const experienceLinks = [
  ["Negociación estratégica", "Acuerdos claros, sostenibles y pensados para crecer.", "#contacto"],
  ["Procesos comerciales", "Estrategia aplicada con seguimiento y resultados medibles.", "#contacto"],
  ["Relaciones internacionales", "Conecto perspectivas para convertir retos en oportunidades.", "#contacto"],
];

export default function TemplateFourPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const onScroll = () => setScrollY(window.scrollY); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);

  const shareContact = async () => {
    const contact = { title: "Mariantonia Sepúlveda", text: "Mariantonia Sepúlveda — Negociadora internacional", url: window.location.href };
    if (navigator.share) await navigator.share(contact).catch(() => undefined);
    else await navigator.clipboard.writeText(window.location.href);
  };

  return <main id="inicio" className="template-four-shell" style={{ "--scroll": `${scrollY}px` } as CSSProperties}>
    <div className="template-four-scene" aria-hidden="true">
      <div className="template-four-orb template-four-orb-one" style={{ transform: `translate3d(${scrollY * .035}px, ${scrollY * .19}px, 0) scale(${1 + scrollY * .00008})` }} />
      <div className="template-four-orb template-four-orb-two" style={{ transform: `translate3d(${-scrollY * .06}px, ${scrollY * -.12}px, 0)` }} />
      <div className="template-four-ring" style={{ transform: `translateX(-50%) rotate(${scrollY * .09}deg) scale(${1 + scrollY * .00012})` }} />
      <div className="template-four-grid" style={{ transform: `perspective(500px) rotateX(64deg) translateY(${scrollY * .13}px)` }} />
      <div className="template-four-grain" />
    </div>
    <header className="template-four-header"><Link href="/">TuBio</Link><span>Negociación · Estrategia · Resultados</span></header>
    <section className="template-four-hero">
      <div className="template-four-portrait" style={{ transform: `translate3d(-50%, ${scrollY * -.045}px, 0) scale(${1 + scrollY * .00004})` }}><div className="template-four-photo-halo"/><Image src="/images/landings/tona-1.png" alt="Retrato de Mariantonia Sepúlveda" fill priority sizes="(max-width: 700px) 100vw, 760px" /></div>
      <div className="template-four-hero-fade" />
      <div className="template-four-identity"><p className="template-four-kicker">Negociadora internacional</p><h1><span>Mariantonia</span><em>Sepúlveda</em></h1><p className="template-four-bio">Adaptación a cada proceso, <strong>con resultados medibles.</strong></p><nav className="template-four-socials" aria-label="Contacto y redes sociales"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a><a href="mailto:hola@tubio.co" aria-label="Correo electrónico"><MailIcon /></a><a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a></nav></div>
    </section>
    <section id="experiencia" className="template-four-links"><p className="template-four-kicker">Te cuento mi experiencia</p><h2>Estrategia que se mueve contigo.</h2><div className="template-four-link-stack">{experienceLinks.map(([title, body, href], index) => <a href={href} key={title} className="template-four-link" style={{ transform: `translate3d(${index % 2 ? Math.max(0, 42 - scrollY * .035) : Math.min(0, -42 + scrollY * .035)}px, ${Math.max(0, 130 - scrollY * .12 - index * 18)}px, 0)` }}><strong>{title}</strong><small>{body}</small></a>)}</div></section>
    <section id="contacto" className="template-four-actions"><a className="template-four-primary-action" href="mailto:hola@tubio.co?subject=Quiero%20agendar%20una%20reunión"><CalendarIcon /><span><small>Conversemos</small>Agenda una reunión</span></a><button type="button" onClick={shareContact}><ShareIcon />Agregar o compartir contacto</button></section>
    <section className="template-four-note"><div className="template-four-note-glow" style={{ transform: `translate3d(${Math.sin(scrollY * .004) * 90}px, ${scrollY * -.035}px, 0)` }} /><p><strong>«Pienso, luego existo»</strong><span>— Frase que Mariantonia no dijo</span></p></section>
    <footer className="template-four-footer"><span>Mariantonia Sepúlveda</span><a className="template-four-seal" href="#inicio" aria-label="Volver arriba"><SealIcon /></a><Link href="/">Ver landings</Link></footer>
  </main>;
}
