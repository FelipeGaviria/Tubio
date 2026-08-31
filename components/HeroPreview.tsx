"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const GUYS = [
  { src: "/guy-pro-max.webp", className: "", name: "Guy Pro Max" },
  { src: "/guyanverse.webp", className: "is-guyanverse", name: "Guyanverse" },
  { src: "/guy-skull.webp", className: "is-guy-skull", name: "Guy Skull" },
  { src: "/guy-muscle.webp", className: "is-guy-muscle", name: "Guy Muscle" },
  { src: "/guy-ussi.webp", className: "is-guy-ussi", name: "GuyUssi" },
];

const NIGHTMARE = { src: "/guy-nightmare.webp", className: "is-guy-nightmare", name: "Guy Nightmare" };
const UNLOCK_KEY = "tubio-guys-unlocked";

export function HeroPreview() {
  const [guyIndex, setGuyIndex] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [nightmareActive, setNightmareActive] = useState(false);
  const [popping, setPopping] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const jumpCount = useRef(0);
  const transitionMode = useRef<"normal" | "nightmare">("normal");

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

    void Promise.all(GUYS.slice(0, 2).map(({ src }) => preload(src))).then(() => {
      if (active) setAssetsReady(true);
      void Promise.all([...GUYS.slice(2), NIGHTMARE].map(({ src }) => preload(src)));
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = Number(localStorage.getItem(UNLOCK_KEY) ?? 0);
      setUnlockedCount(saved > 0 ? 3 : 0);
    }, 0);
    const toggleUnlock = () => setUnlockedCount((current) => {
      const next = current === 0 ? 3 : 0;
      localStorage.setItem(UNLOCK_KEY, String(next));
      if (next === 0) {
        setGuyIndex((index) => index % 2);
        setNightmareActive(false);
      }
      return next;
    });
    window.addEventListener("tubio:guy-unlock-next", toggleUnlock);
    return () => { window.clearTimeout(timer); window.removeEventListener("tubio:guy-unlock-next", toggleUnlock); };
  }, []);

  useEffect(() => {
    if (!popping) return;

    const swapTimer = window.setTimeout(() => {
      if (transitionMode.current === "nightmare") setNightmareActive(true);
      else { setNightmareActive(false); setGuyIndex((current) => (current + 1) % (2 + unlockedCount)); }
    }, 130);
    const resetTimer = window.setTimeout(() => setPopping(false), 420);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(resetTimer);
    };
  }, [popping, unlockedCount]);

  const swapGuy = () => {
    if (!assetsReady || popping) return;

    jumpCount.current += 1;
    transitionMode.current = jumpCount.current % 13 === 0 ? "nightmare" : "normal";
    setPopping(true);
  };

  const availableCount = 2 + unlockedCount;
  const currentGuy = nightmareActive ? NIGHTMARE : GUYS[guyIndex % availableCount];
  const nextGuy = GUYS[(guyIndex + 1) % availableCount];

  return (
    <div className="hero-preview" aria-label="Vista previa de landing responsive">
      <div className="hero-orbit" aria-hidden="true" />
      <ThemeToggle />
      <button className={`hero-artifact ${currentGuy.className} ${popping ? "is-popping" : ""}`} type="button" onClick={swapGuy} disabled={!assetsReady} aria-busy={!assetsReady} aria-label={assetsReady ? `Cambiar de ${currentGuy.name} a ${nextGuy.name}` : "Cargando personajes"}>
      </button>
    </div>
  );
}
