"use client";

import { useEffect, useState } from "react";

const storageKey = "tubio-portfolio-theme";

export default function PortfolioThemeToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) === "night";
    document.documentElement.dataset.portfolioTheme = saved ? "night" : "day";
    const frame = window.requestAnimationFrame(() => setNight(saved));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next = !night;
    setNight(next);
    document.documentElement.dataset.portfolioTheme = next ? "night" : "day";
    window.localStorage.setItem(storageKey, next ? "night" : "day");
  };

  return <button type="button" className="raw-theme-toggle raw-night-button" onClick={toggle} role="switch" aria-checked={night} aria-label={night ? "Cambiar a modo claro" : "Cambiar a modo nocturno"} title={night ? "Modo claro" : "Modo nocturno"}><svg aria-hidden="true" viewBox="0 0 24 24">{night ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></> : <path d="M19.2 15.2A8 8 0 0 1 8.8 4.8 8 8 0 1 0 19.2 15.2Z" />}</svg></button>;
}
