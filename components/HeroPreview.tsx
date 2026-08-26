"use client";

import { useState } from "react";

export function HeroPreview() {
  const [alternate, setAlternate] = useState(false);
  const [popping, setPopping] = useState(false);

  const swapGuy = () => {
    setPopping(true);
    window.setTimeout(() => setAlternate((current) => !current), 130);
    window.setTimeout(() => setPopping(false), 420);
  };

  return (
    <div className="hero-preview" aria-label="Vista previa de landing responsive">
      <div className="hero-orbit" aria-hidden="true" />
      <button className={`hero-artifact ${alternate ? "is-guyanverse" : ""} ${popping ? "is-popping" : ""}`} type="button" onClick={swapGuy} aria-label={alternate ? "Cambiar a Guy Pro Max" : "Cambiar a Guyanverse"}>
      </button>
    </div>
  );
}
