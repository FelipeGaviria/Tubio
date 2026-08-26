"use client";

import { useEffect, useState } from "react";

const GUY_IMAGES = ["/guy-pro-max.webp", "/guyanverse.webp"];

export function HeroPreview() {
  const [alternate, setAlternate] = useState(false);
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

    void Promise.all(GUY_IMAGES.map(preload)).then(() => {
      if (active) setAssetsReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!popping) return;

    const swapTimer = window.setTimeout(() => setAlternate((current) => !current), 130);
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

  return (
    <div className="hero-preview" aria-label="Vista previa de landing responsive">
      <div className="hero-orbit" aria-hidden="true" />
      <button className={`hero-artifact ${alternate ? "is-guyanverse" : ""} ${popping ? "is-popping" : ""}`} type="button" onClick={swapGuy} disabled={!assetsReady} aria-busy={!assetsReady} aria-label={assetsReady ? (alternate ? "Cambiar a Guy Pro Max" : "Cambiar a Guyanverse") : "Cargando personajes"}>
      </button>
    </div>
  );
}
