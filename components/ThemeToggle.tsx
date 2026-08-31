"use client";

import { type CSSProperties, type MouseEvent, useRef, useState } from "react";

export function ThemeToggle() {
  const [night, setNight] = useState(false);
  const [wipe, setWipe] = useState<{ x: number; y: number; to: "night" | "day" } | null>(null);
  const changing = useRef(false);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (changing.current) return;
    changing.current = true;
    const next = !night;
    const bounds = event.currentTarget.getBoundingClientRect();
    setWipe({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2, to: next ? "night" : "day" });
    window.setTimeout(() => {
      setNight(next);
      document.documentElement.dataset.tubioTheme = next ? "night" : "day";
    }, 330);
    window.setTimeout(() => {
      setWipe(null);
      changing.current = false;
    }, 820);
  };

  return <>
    {wipe ? <span className={`tubio-theme-wipe is-${wipe.to}`} style={{ "--wipe-x": `${wipe.x}px`, "--wipe-y": `${wipe.y}px` } as CSSProperties} aria-hidden="true" /> : null}
    <button className="home-theme-toggle" type="button" onClick={toggle} aria-pressed={night} aria-label={night ? "Activar modo claro" : "Activar modo nocturno"} title={night ? "Modo claro" : "Modo nocturno"}>
      <svg aria-hidden="true" viewBox="0 0 24 24">{night ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></> : <path d="M19.2 15.2A8 8 0 0 1 8.8 4.8 8 8 0 1 0 19.2 15.2Z" />}</svg>
    </button>
  </>;
}
