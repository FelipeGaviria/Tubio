"use client";

import { useEffect, useState } from "react";
import { FooterInstallButton } from "@/components/FooterInstallButton";

export function ClubAppControls({ club, appName }: { club: "toastmasters" | "rotaract"; appName: string }) {
  const [night, setNight] = useState(false);
  useEffect(() => {
    if (club !== "rotaract") return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const previous = meta?.content;
    if (meta) meta.content = night ? "#0d1421" : "#f6f7fc";
    return () => { if (meta && previous) meta.content = previous; };
  }, [club, night]);
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(`[data-club="${club}"]`);
    let preference: string | null = null;
    try { preference = localStorage.getItem(`tubio-${club}-theme`); } catch { /* Usar el modo diurno. */ }
    const apply = () => {
      const dark = preference === "night";
      if (page) page.dataset.clubTheme = dark ? "night" : "day";
      setNight(dark);
    };
    const timer = window.setTimeout(apply, 0);
    return () => window.clearTimeout(timer);
  }, [club]);

  function toggleTheme() {
    const next = !night;
    setNight(next);
    const page = document.querySelector<HTMLElement>(`[data-club="${club}"]`);
    if (page) page.dataset.clubTheme = next ? "night" : "day";
    try { localStorage.setItem(`tubio-${club}-theme`, next ? "night" : "day"); } catch { /* El cambio sigue activo en esta visita. */ }
  }

  return <div className="club-app-controls">
    <button className="club-icon-button" type="button" onClick={toggleTheme} aria-label={night ? "Activar modo día" : "Activar modo noche"} title={night ? "Modo día" : "Modo noche"}>
      <svg aria-hidden="true" viewBox="0 0 24 24">{night ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>}</svg>
    </button>
    <FooterInstallButton appName={appName} className="club-icon-button" />
  </div>;
}
