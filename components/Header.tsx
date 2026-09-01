"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { site, whatsappUrl } from "@/content/site";

function PersonIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M5 20c.7-3.7 3-5.5 7-5.5s6.3 1.8 7 5.5" /></svg>; }
function LockIcon() { return <svg className="workspace-lock" aria-label="Acceso con clave" viewBox="0 0 16 16"><rect x="3.5" y="7" width="9" height="6.5" rx="1.6" /><path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" /></svg>; }

const workspaceLinks = [
  { label: "Portafolio", href: "/portafolio", note: "Trabajo seleccionado", locked: false },
  { label: "Tarifario MERO", href: "/tarifario", note: "Tarifas para proveedores", locked: false },
  { label: "Toastmasters Asistencias", href: "/asistencias", note: "Registro de sesiones", locked: true },
  { label: "Rotaract Nuevo Medellín", href: "/rotaract", note: "Calendario y asistencias", locked: true },
  { label: "Social Calendars", href: "/social-calendars", note: "Planeación de contenidos", locked: true },
  { label: "Orden curso", href: "/orden", note: "Ruta de aprendizaje", locked: true },
];

export function Header({ endAction }: { endAction?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);
  const workspaceRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!workspaceOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!workspaceRef.current?.contains(event.target as Node)) setWorkspaceOpen(false);
    };
    const closeOnMove = () => setWorkspaceOpen(false);
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("scroll", closeOnMove, { passive: true });
    window.addEventListener("touchmove", closeOnMove, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("scroll", closeOnMove);
      window.removeEventListener("touchmove", closeOnMove);
    };
  }, [workspaceOpen]);

  return <header className={`site-header ${open ? "menu-open" : ""} ${hidden ? "header-hidden" : ""} ${scrolled ? "header-scrolled" : ""}`}>
    <Link className="brand" href="/" aria-label={`${site.name} inicio`}><Image className="brand-logo" src="/logo-tubio.png" alt="" width={42} height={42} priority /><span>{site.name}</span></Link>
    <button className="mobile-menu-toggle" type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}><i /><i /><i /></button>
    <nav aria-label="Navegación principal"><Link href="/" onClick={() => setOpen(false)}>Inicio</Link></nav>
    <div className="header-actions">
      <a className="header-cta" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Contáctame</a>
      <div ref={workspaceRef} className={`workspace-menu ${workspaceOpen ? "is-open" : ""}`}>
        <button className="header-profile-link" type="button" aria-label="Abrir accesos" aria-expanded={workspaceOpen} onClick={() => setWorkspaceOpen(!workspaceOpen)}><PersonIcon /></button>
        <div className="workspace-popover" aria-label="Accesos rápidos">
          <p>Tu espacio</p>
          {workspaceLinks.map((item) => <Link key={item.href} href={item.href} onClick={() => setWorkspaceOpen(false)}><span>{item.label}{item.locked && <LockIcon />}</span><small>{item.note}</small></Link>)}
        </div>
      </div>
      {endAction}
    </div>
  </header>;
}
