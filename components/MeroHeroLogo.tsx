"use client";

import Image from "next/image";
import { useState } from "react";

export function MeroHeroLogo() {
  const [bubbling, setBubbling] = useState(false);

  const makeBubbles = () => {
    setBubbling(false);
    window.requestAnimationFrame(() => {
      setBubbling(true);
      window.setTimeout(() => setBubbling(false), 850);
    });
  };

  return <button className={`mero-hero-art ${bubbling ? "is-bubbling" : ""}`} type="button" onClick={makeBubbles} aria-label="Hacer burbujas con el logo de MERO">
    <Image src="/images/mero/logo-mero.png" alt="MERO Estudio" fill priority sizes="(max-width: 760px) 44vw, 42vw" />
    <span className="mero-bubbles" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</span>
  </button>;
}
