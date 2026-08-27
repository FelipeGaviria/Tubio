"use client";

import { useEffect, useState } from "react";

const GUYS = [
  { src: "/guy-pro-max.webp", className: "", name: "Guy Pro Max" },
  { src: "/guyanverse.webp", className: "is-guyanverse", name: "Guyanverse" },
  { src: "/guy-ussi.webp", className: "is-guy-ussi", name: "GuyUssi" },
];

export function HeroPreview() {
  const [guyIndex, setGuyIndex] = useState(0);
  const [popping, setPopping] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const preload = async (src: string) => {
      const image = new window.Image();
      await new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;
      });

      try { await image.decode(); } catch { /* El fondo conserva su fallback del navegador. */ }
    };

    void Promise.all(GUYS.map(({ src }) => preload(src))).then(() => {
      if (active) setAssetsReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!popping) return;

    const swapTimer = window.setTimeout(() => setGuyIndex((current) => (current + 1) % GUYS.length), 130);
    const resetTimer = window.setTimeout(() => setPopping(false), 420);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(resetTimer);
    };
  }, [popping]);

  const swapGuy = () => {
    if (!assetsReady || popping) return;

    setPopping(true);
  };

  const currentGuy = GUYS[guyIndex];
  const nextGuy = GUYS[(guyIndex + 1) % GUYS.length];

  return (
    <div className="hero-preview" aria-label="Vista previa de landing responsive">
      <div className="hero-orbit" aria-hidden="true" />
      <button className={`hero-artifact ${currentGuy.className} ${popping ? "is-popping" : ""}`} type="button" onClick={swapGuy} disabled={!assetsReady} aria-busy={!assetsReady} aria-label={assetsReady ? `Cambiar de ${currentGuy.name} a ${nextGuy.name}` : "Cargando personajes"}>
      </button>
    </div>
  );
}
