"use client";

import { useEffect, useState } from "react";

const storageKey = "tubio-portfolio-theme";

export default function PortfolioThemeToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) === "night";
    setNight(saved);
    document.documentElement.dataset.portfolioTheme = saved ? "night" : "day";
  }, []);

  const toggle = () => {
    const next = !night;
    setNight(next);
    document.documentElement.dataset.portfolioTheme = next ? "night" : "day";
    window.localStorage.setItem(storageKey, next ? "night" : "day");
  };

  return <button type="button" className="raw-theme-toggle" onClick={toggle} role="switch" aria-checked={night} aria-label={night ? "Cambiar a modo claro" : "Cambiar a modo nocturno"}><span className="raw-theme-toggle-icon">☼</span><span className="raw-theme-toggle-track"><span /></span><span className="raw-theme-toggle-icon">☾</span></button>;
}