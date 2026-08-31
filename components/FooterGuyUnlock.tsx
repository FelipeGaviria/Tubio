"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const HOLD_TIME = 750;

export function FooterGuyUnlock() {
  const timer = useRef<number | null>(null);
  const held = useRef(false);
  const [charging, setCharging] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

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
      setUnlocking(false);
      window.requestAnimationFrame(() => setUnlocking(true));
      window.dispatchEvent(new CustomEvent("tubio:guy-unlock-next"));
      window.setTimeout(() => setUnlocking(false), 720);
    }, HOLD_TIME);
  };

  const goToTop = () => {
    if (held.current) {
      held.current = false;
      return;
    }
    document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <button className={`footer-logo-link footer-guy-unlock ${charging ? "is-charging" : ""} ${unlocking ? "is-unlocking" : ""}`} type="button" aria-label="Volver al inicio; mantener presionado para alternar los personajes secretos" onPointerDown={startHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold} onContextMenu={(event) => event.preventDefault()} onDragStart={(event) => event.preventDefault()} onSelect={(event) => event.preventDefault()} onClick={goToTop}>
    <Image src="/logo-tubio.png" alt="TuBio" width={46} height={46} draggable={false} />
  </button>;
}
