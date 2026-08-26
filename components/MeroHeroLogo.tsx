"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

const bubbleX = [50, 42, 59, 31, 69, 47, 54, 22, 78, 38, 64, 15, 86, 45, 57, 27, 73, 8, 92, 35, 67, 19, 82, 51, 40, 61, 12, 89];
const bubbleY = [42, 55, 48, 35, 62, 70, 27, 52, 39, 76, 20, 65, 50, 31, 72, 18, 81, 43, 29, 67, 45, 12, 59, 84, 24, 64, 75, 16];

const bubbleStyle = (index: number) => ({
  "--bubble-x": `${bubbleX[index]}%`,
  "--bubble-y": `${bubbleY[index]}%`,
  "--bubble-size": `${16 + ((index * 9) % 32)}px`,
  "--bubble-delay": `${(index % 8) * 55}ms`,
  "--bubble-drift": `${-18 + ((index * 13) % 37)}px`,
  "--bubble-rise": `${-(100 + ((index * 23) % 100))}px`,
  "--bubble-duration": `${1250 + ((index * 47) % 450)}ms`,
} as CSSProperties);

export function MeroHeroLogo() {
  const [bubbling, setBubbling] = useState(false);

  const makeBubbles = () => {
    setBubbling(false);
    window.requestAnimationFrame(() => {
      setBubbling(true);
      window.setTimeout(() => setBubbling(false), 2200);
    });
  };

  return <button className={`mero-hero-art ${bubbling ? "is-bubbling" : ""}`} type="button" onClick={makeBubbles} aria-label="Hacer burbujas con el logo de MERO">
    <Image src="/images/mero/logo-mero.png" alt="MERO Estudio" fill priority sizes="(max-width: 760px) 44vw, 42vw" />
    <span className="mero-bubbles" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={bubbleStyle(index)} />)}</span>
  </button>;
}

export function MeroShareButton() {
  const [shared, setShared] = useState(false);

  const share = async () => {
    const data = { title: "Tarifario 2026 · MERO Estudio", text: "Antes de trabajar con MERO, revisa aquí tarifas y condiciones.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch { /* El usuario puede cerrar el panel nativo sin compartir. */ }
  };

  return <button className="mero-share" type="button" onClick={share} aria-label={shared ? "Enlace copiado" : "Compartir tarifario"} title={shared ? "Link copiado" : "Compartir"}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" /></svg></button>;
}
