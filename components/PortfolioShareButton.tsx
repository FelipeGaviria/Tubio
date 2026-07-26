"use client";

import { useState } from "react";

export default function PortfolioShareButton() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const payload = { title: "Portafolio de Felipe Gaviria", text: "Mira el portafolio de Felipe Gaviria", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    } catch (error) { if ((error as DOMException).name !== "AbortError") { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } }
  };
  return <button type="button" className="raw-profile-share" onClick={share} aria-label="Compartir portafolio" title={copied ? "Enlace copiado" : "Compartir portafolio"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3" /><path d="m7 8 5-5 5 5" /><path d="M5 14v5h14v-5" /></svg><span>{copied ? "Copiado" : "Compartir"}</span></button>;
}