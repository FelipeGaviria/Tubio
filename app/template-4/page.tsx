"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

const InstagramIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" className="fill"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>;
const WhatsAppIcon = () => <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27 15.7A11 11 0 0 1 10.7 25.3L4.4 27l1.7-6.1A11 11 0 1 1 27 15.7Z"/><path d="M11.1 9.9c.3-.6.6-.6 1-.6h.7c.3 0 .5.1.7.6l1 2.6c.2.4 0 .7-.2.9l-.9 1c-.2.3-.2.5 0 .8 1 1.8 2.5 3.2 4.4 4 .4.2.7.1.9-.2l1.2-1.4c.3-.3.6-.4.9-.2l2.5 1.2c.4.2.5.4.5.8 0 .6-.3 1.8-1.2 2.6-.8.8-2 1-3.3.7-1.3-.3-3-.9-5-2.2-3.6-2.3-6-6-6.6-8.2-.6-2.1.3-3.3 1.1-3.8"/></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4m8-4v4M3 10h18"/></svg>;
const ShareIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/></svg>;
const ThemeIcon = ({ light }: { light: boolean }) => light ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.4A8 8 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4Z"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;

const experienceLinks = [
  ["Negociación estratégica", "Acuerdos claros, sostenibles y pensados para crecer.", "#contacto"],
  ["Procesos comerciales", "Estrategia aplicada con seguimiento y resultados medibles.", "#contacto"],
  ["Relaciones internacionales", "Conecto perspectivas para convertir retos en oportunidades.", "#contacto"],
];

export default function TemplateFourPage() {
  const [scrollY, setScrollY] = useState(0);
  const [lightMode, setLightMode] = useState(false);
  useEffect(() => {
    let target = window.scrollY, current = target, frame = 0;
    const render = () => { current += (target - current) * .085; if (Math.abs(target - current) < .05) current = target; setScrollY(current); frame = requestAnimationFrame(render); };
    const onScroll = () => { target = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true }); frame = requestAnimationFrame(render);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  const shareContact = async () => {
    const contact = { title: "Mariantonia Sepúlveda", text: "Mariantonia Sepúlveda — Negociadora internacional", url: window.location.href };
    if (navigator.share) await navigator.share(contact).catch(() => undefined);
    else await navigator.clipboard.writeText(window.location.href);
  };

  return <main id="inicio" className={`template-four-shell${lightMode ? " is-light" : ""}`} style={{ "--scroll": `${scrollY}px` } as CSSProperties}>
    <div className="template-four-scene" aria-hidden="true">
      <div className="template-four-orb template-four-orb-one" style={{ transform: `translate3d(${scrollY * .018}px, ${scrollY * .09}px, 0) scale(${1 + scrollY * .000035})` }} />
      <div className="template-four-orb template-four-orb-two" style={{ transform: `translate3d(${-scrollY * .025}px, ${scrollY * -.045}px, 0)` }} />
      <div className="template-four-ring" style={{ transform: `translateX(-50%) rotate(${scrollY * .035}deg) scale(${1 + scrollY * .00004})` }} />
      <div className="template-four-grid" style={{ transform: `perspective(500px) rotateX(64deg) translateY(${scrollY * .055}px)` }} />
      <div className="template-four-grain" />
    </div>
    <header className="template-four-header"><Link href="/">TuBio</Link><span>Negociación · Estrategia · Resultados</span></header>
    <section className="template-four-hero">
      <div className="template-four-portrait" style={{ transform: `translate3d(-50%, ${scrollY * -.018}px, 0) scale(${1 + scrollY * .000015})` }}><div className="template-four-photo-halo"/><Image className="template-four-photo-main" src="/images/landings/tona-1.png" alt="Retrato de Mariantonia Sepúlveda" fill priority quality={100} sizes="(max-width: 700px) 112vw, 900px" /></div>
      <div className="template-four-hero-fade" />
      <div className="template-four-identity"><p className="template-four-kicker">Negociadora internacional</p><h1><span>Mariantonia</span><em>Sepúlveda</em></h1><p className="template-four-bio">Adaptación a cada proceso, <strong>con resultados medibles.</strong></p>
        <div className="template-four-profile-glass">
          <nav className="template-four-socials" aria-label="Contacto y redes sociales"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a><a href="mailto:hola@tubio.co" aria-label="Correo electrónico"><MailIcon /></a><a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a></nav>
          <section id="experiencia" className="template-four-links"><p className="template-four-kicker">Te cuento mi experiencia</p><h2>Estrategia que se mueve contigo.</h2><div className="template-four-link-stack">{experienceLinks.map(([title, body, href]) => <a href={href} key={title} className="template-four-link"><strong>{title}</strong><small>{body}</small></a>)}</div></section>
          <section id="contacto" className="template-four-actions"><a className="template-four-primary-action" href="mailto:hola@tubio.co?subject=Quiero%20agendar%20una%20reunión"><CalendarIcon /><span><small>Conversemos</small>Agenda una reunión</span></a><div className="template-four-utility"><button type="button" onClick={shareContact} aria-label="Compartir contacto"><ShareIcon /></button><button type="button" onClick={() => setLightMode(value => !value)} aria-label={lightMode ? "Activar modo noche" : "Activar modo día"}><ThemeIcon light={lightMode} /></button></div></section>
        </div>
      </div>
    </section>
    <section className="template-four-note"><div className="template-four-note-glow" style={{ transform: `translate3d(${Math.sin(scrollY * .002) * 35}px, ${scrollY * -.012}px, 0)` }} /><p><strong>«Pienso, luego existo»</strong><span>— Frase que Mariantonia no dijo</span></p></section>
    <footer className="template-four-footer"><span>Mariantonia Sepúlveda</span><a className="template-four-seal" href="#inicio" aria-label="Volver arriba"><Image src="/images/landings/foca.png" alt="" width={120} height={120} /></a><Link href="/">Ver landings</Link></footer>
  </main>;
}
