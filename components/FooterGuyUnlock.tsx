"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const HOLD_TIME = 750;

export function FooterGuyUnlock() {
  const timer = useRef<number | null>(null);
  const held = useRef(false);
  const [charging, setCharging] = useState(false);
  const [action, setAction] = useState<"unlocking" | "locking" | null>(null);

  const cancelHold = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    setCharging(false);
  };

  const startHold = () => {
    held.current = false;
    cancelHold();
    setCharging(true);
    timer.current = window.setTimeout(() => {
      held.current = true;
      setCharging(false);
      const nextAction = Number(localStorage.getItem("tubio-guys-unlocked") ?? 0) > 0 ? "locking" : "unlocking";
      setAction(null);
      window.requestAnimationFrame(() => setAction(nextAction));
      window.dispatchEvent(new CustomEvent("tubio:guy-unlock-next"));
      window.setTimeout(() => setAction(null), 900);
    }, HOLD_TIME);
  };

  const goToTop = () => {
    if (held.current) {
      held.current = false;
      return;
    }
    document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <button className={`footer-logo-link footer-guy-unlock ${charging ? "is-charging" : ""} ${action ? `is-${action}` : ""}`} type="button" aria-label="Volver al inicio; mantener presionado para alternar los personajes secretos" onPointerDown={startHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold} onContextMenu={(event) => event.preventDefault()} onDragStart={(event) => event.preventDefault()} onSelect={(event) => event.preventDefault()} onClick={goToTop}>
    <Image src="/logo-tubio.png" alt="TuBio" width={46} height={46} draggable={false} />
    <span className="footer-lock-click" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></svg></span>
  </button>;
}
