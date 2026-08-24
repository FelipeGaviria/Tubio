"use client";

import { FormEvent, useState } from "react";

export function OrderUnlock() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/orden/desbloquear", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!response.ok) {
        setError("Código incorrecto.");
        return;
      }
      window.location.assign("/orden");
    } catch {
      setError("No fue posible validar el código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="order-unlock" onSubmit={unlock}>
      <span className="order-empty-icon" aria-hidden="true">⌁</span>
      <p className="eyebrow">Sección privada</p>
      <h2>Desbloquear Orden</h2>
      <p>El mapa y la checklist no se envían al navegador hasta validar el código.</p>
      <label htmlFor="order-code">Código de acceso</label>
      <div className="order-unlock-row">
        <input id="order-code" inputMode="numeric" autoComplete="one-time-code" maxLength={12} value={code} onChange={(event) => setCode(event.target.value)} required />
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? "Validando…" : "Entrar"}</button>
      </div>
      {error && <p className="order-import-error" role="alert">{error}</p>}
    </form>
  );
}
