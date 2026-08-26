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
      <div className="preview-window">
        <div className="preview-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="preview-hero">
          <div className="preview-copy">
            <div className="line line-wide" />
            <div className="line line-mid" />
            <div className="line line-short" />
          </div>
          <div className="preview-card" />
        </div>
        <div className="preview-grid">
          <div />
          <div />
          <div />
        </div>
      </div>
      <button className={`hero-artifact ${alternate ? "is-guyanverse" : ""} ${popping ? "is-popping" : ""}`} type="button" onClick={swapGuy} aria-label={alternate ? "Cambiar a Guy Pro Max" : "Cambiar a Guyanverse"}>
        <span className="hero-artifact-spark" aria-hidden="true" />
      </button>
    </div>
  );
}
