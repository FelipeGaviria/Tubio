"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

const bubbleStyle = (index: number) => ({
  "--bubble-x": `${5 + ((index * 23) % 91)}%`,
  "--bubble-y": `${7 + ((index * 31) % 70)}%`,
  "--bubble-size": `${6 + ((index * 7) % 25)}px`,
  "--bubble-delay": `${(index % 9) * 48}ms`,
  "--bubble-drift": `${-44 + ((index * 29) % 89)}px`,
  "--bubble-rise": `${-(65 + ((index * 31) % 105))}px`,
  "--bubble-duration": `${900 + ((index * 47) % 520)}ms`,
} as CSSProperties);

export function MeroHeroLogo() {
  const [bubbling, setBubbling] = useState(false);

  const makeBubbles = () => {
    setBubbling(false);
    window.requestAnimationFrame(() => {
      setBubbling(true);
      window.setTimeout(() => setBubbling(false), 2000);
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
