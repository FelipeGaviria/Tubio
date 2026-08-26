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

  return <button className="mero-share" type="button" onClick={share} aria-label="Compartir tarifario"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" /></svg><span>{shared ? "Link copiado" : "Compartir"}</span></button>;
}
