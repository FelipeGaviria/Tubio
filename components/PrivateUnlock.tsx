"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function PrivateUnlock({ title, description, endpoint, destination }: { title: string; description: string; endpoint: string; destination: string }) {
  const [code, setCode] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function validate(nextCode: string) {
    if (loading || nextCode.length !== 4) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: nextCode }) });
      const result = await response.json() as { locked?: boolean; attemptsRemaining?: number };
      if (!response.ok) { setError(result.locked ? "Demasiados intentos. Acceso bloqueado durante 2 horas." : `Código incorrecto. ${result.attemptsRemaining ?? 0} intentos disponibles.`); setCode(""); return; }
      window.location.assign(destination);
    } catch { setError("No fue posible validar el acceso."); }
    finally { setLoading(false); }
  }
  function unlock(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void validate(code.trim()); }
  return <main className="tubio-private-lock"><form onSubmit={unlock}><Image src="/logo-tubio.png" alt="TuBio" width={64} height={64} priority /><p>Tu espacio / privado</p><h1>{title}</h1><span>{description}</span><label>Código de acceso<input autoFocus type="password" inputMode="numeric" maxLength={4} value={code} onChange={(event) => { const next = event.target.value.replace(/\D/g, ""); setCode(next); setError(""); if (next.length === 4) void validate(next); }} placeholder="••••" aria-invalid={Boolean(error)} /></label>{error && <small role="alert">{error}</small>}<button type="submit" disabled={loading || code.length !== 4}>{loading ? "Validando…" : "Entrar"}</button><Link href="/">Volver a TuBio</Link></form></main>;
}
