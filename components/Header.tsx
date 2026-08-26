"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { site, whatsappUrl } from "@/content/site";

function PersonIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M5 20c.7-3.7 3-5.5 7-5.5s6.3 1.8 7 5.5" /></svg>; }

const workspaceLinks = [
  { label: "Social Calendars", href: "/social-calendars", note: "Planeación de contenidos" },
  { label: "Asistencias", href: "/asistencias", note: "Registro del equipo" },
  { label: "Orden", href: "/orden", note: "Ruta de aprendizaje" },
  { label: "Portafolio", href: "/portafolio", note: "Trabajo seleccionado" },
  { label: "Tarifario MERO", href: "/tarifario", note: "Tarifas para proveedores" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 24);
      setHidden(current > lastScroll.current && current > 120);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <header className={`site-header ${open ? "menu-open" : ""} ${hidden ? "header-hidden" : ""} ${scrolled ? "header-scrolled" : ""}`}>
    <Link className="brand" href="/" aria-label={`${site.name} inicio`}><Image className="brand-logo" src="/logo-tubio.png" alt="" width={42} height={42} priority /><span>{site.name}</span></Link>
    <button className="mobile-menu-toggle" type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /><i /></button>
    <nav aria-label="Navegación principal"><Link href="/" onClick={() => setOpen(false)}>Inicio</Link></nav>
    <div className="header-actions">
      <div className={`workspace-menu ${workspaceOpen ? "is-open" : ""}`}>
        <button className="header-profile-link" type="button" aria-label="Abrir accesos" aria-expanded={workspaceOpen} onClick={() => setWorkspaceOpen(!workspaceOpen)}><PersonIcon /></button>
        <div className="workspace-popover" aria-label="Accesos rápidos">
          <p>Tu espacio</p>
          {workspaceLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setWorkspaceOpen(false)}><span>{item.label}</span><small>{item.note}</small></Link>)}
        </div>
      </div>
      <a className="header-cta" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Contactar</a>
    </div>
  </header>;
}
