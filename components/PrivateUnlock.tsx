"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function PrivateUnlock({ title, description, endpoint, destination }: { title: string; description: string; endpoint: string; destination: string }) {
  const [code, setCode] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: code.trim() }) });
      if (!response.ok) { setError("Código incorrecto."); return; }
      window.location.assign(destination);
    } catch { setError("No fue posible validar el acceso."); }
    finally { setLoading(false); }
  }
  return <main className="tubio-private-lock"><form onSubmit={unlock}><Image src="/logo-tubio.png" alt="TuBio" width={64} height={64} priority /><p>Tu espacio / privado</p><h1>{title}</h1><span>{description}</span><label>Código de acceso<input autoFocus type="password" inputMode="numeric" maxLength={4} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="••••" aria-invalid={Boolean(error)} /></label>{error && <small role="alert">{error}</small>}<button type="submit" disabled={loading}>{loading ? "Validando…" : "Entrar"}</button><Link href="/">Volver a TuBio</Link></form></main>;
}
