"use client";

import { useEffect, useRef, useState } from "react";
import { RotaryWheel } from "@/components/RotaryWheel";

export function RotaractHomeButton({ active, unlocked, onNavigate, onEdit }: { active: boolean; unlocked: boolean; onNavigate: () => void; onEdit: () => void }) {
  const [holding, setHolding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const callback = useRef(onEdit);
  useEffect(() => { callback.current = onEdit; }, [onEdit]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); if (completedTimer.current) clearTimeout(completedTimer.current); }, []);
  function cancel() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    origin.current = null;
    setHolding(false);
  }
  function start() {
    if (timer.current) return;
    fired.current = false;
    setCompleted(false);
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      fired.current = true;
      setHolding(false);
      setCompleted(true);
      callback.current();
      completedTimer.current = setTimeout(() => setCompleted(false), 700);
    }, 2000);
  }
  function navigate() {
    if (fired.current) { fired.current = false; return; }
    onNavigate();
    window.location.hash = "inicio";
  }
  return <button type="button" className={`rotaract-home-button ${holding ? "is-holding" : ""} ${completed ? "hold-complete" : ""} ${unlocked ? "is-editing" : ""}`} aria-current={active ? "page" : undefined} aria-label={`Inicio. Mantén pulsado 2 segundos para ${unlocked ? "cerrar" : "desbloquear"} edición`} title={`Mantén 2 segundos para ${unlocked ? "cerrar" : "desbloquear"} edición`}
    onPointerDown={(event) => { if (!event.isPrimary || event.button !== 0) return; origin.current = { x: event.clientX, y: event.clientY }; start(); }}
    onPointerMove={(event) => { if (origin.current && Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > 12) cancel(); }}
    onPointerUp={cancel} onPointerCancel={cancel} onPointerLeave={cancel} onBlur={cancel}
    onContextMenu={(event) => event.preventDefault()} onClick={navigate}
    onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); if (!event.repeat) start(); } if (event.key === "Escape") cancel(); }}
    onKeyUp={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); cancel(); navigate(); } }}>
    <span className="home-wheel-wrap"><RotaryWheel decorative /><svg className="home-hold-progress" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" pathLength="100"/></svg></span><span>Inicio</span>
  </button>;
}
