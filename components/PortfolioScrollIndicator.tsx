"use client";

import { useEffect, useState } from "react";

const segments = Array.from({ length: 27 });

export default function PortfolioScrollIndicator() {
  const [progress, setProgress] = useState(0);
  useEffect(() => { const update = () => { const maximum = document.documentElement.scrollHeight - window.innerHeight; setProgress(maximum > 0 ? window.scrollY / maximum : 0); }; update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); }; }, []);
  const active = Math.round(progress * (segments.length - 1));
  return <nav className="raw-scroll-indicator" aria-label="Progreso de navegación">{segments.map((_, index) => <span key={index} className={index <= active ? "is-active" : ""} />)}</nav>;
}