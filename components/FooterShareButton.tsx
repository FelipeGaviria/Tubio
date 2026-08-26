"use client";

import { useState } from "react";

export function FooterShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: "TuBio", text: "Mira esta página de TuBio", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* El panel nativo puede cerrarse sin compartir. */ }
  };

  return <button className="footer-share" type="button" onClick={share} aria-label={copied ? "Enlace copiado" : "Compartir página"} title={copied ? "Link copiado" : "Compartir"}>
    <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" /></svg>
  </button>;
}
