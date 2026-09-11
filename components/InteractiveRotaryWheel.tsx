"use client";

import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { RotaryWheel } from "@/components/RotaryWheel";

const STEP = 10;
const RETURN_DELAY = 3000;

function pointerAngle(element: HTMLElement, x: number, y: number) {
  const bounds = element.getBoundingClientRect();
  return Math.atan2(y - (bounds.top + bounds.height / 2), x - (bounds.left + bounds.width / 2)) * 180 / Math.PI;
}

function shortestTurn(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

export function InteractiveRotaryWheel() {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [returning, setReturning] = useState(false);
  const lastAngle = useRef(0);
  const rawRotation = useRef(0);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    if (settleTimer.current) clearTimeout(settleTimer.current);
  }, []);

  function clearTimers() {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    returnTimer.current = null;
    settleTimer.current = null;
  }

  function scheduleReturn() {
    clearTimers();
    returnTimer.current = setTimeout(() => {
      setReturning(true);
      rawRotation.current = 0;
      setRotation(0);
      settleTimer.current = setTimeout(() => setReturning(false), 1100);
    }, RETURN_DELAY);
  }

  function tick() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(7);
    try {
      const Context = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Context) return;
      const context = audioContext.current ?? new Context();
      audioContext.current = context;
      if (context.state === "suspended") void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(860, context.currentTime);
      gain.gain.setValueAtTime(.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .025);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + .028);
    } catch { /* El fidget sigue funcionando si el navegador bloquea audio. */ }
  }

  function begin(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    clearTimers();
    setReturning(false);
    setDragging(true);
    rawRotation.current = rotation;
    lastAngle.current = pointerAngle(event.currentTarget, event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || !event.isPrimary) return;
    const angle = pointerAngle(event.currentTarget, event.clientX, event.clientY);
    rawRotation.current += shortestTurn(lastAngle.current, angle);
    lastAngle.current = angle;
    const next = Math.round(rawRotation.current / STEP) * STEP;
    if (next !== rotation) tick();
    setRotation(next);
  }

  function end(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    scheduleReturn();
  }

  function rotateWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    clearTimers();
    setReturning(false);
    const next = rotation + (event.key === "ArrowRight" ? STEP : -STEP);
    rawRotation.current = next;
    tick();
    setRotation(next);
    scheduleReturn();
  }

  return <div className={`interactive-rotary-wheel ${dragging ? "is-dragging" : ""} ${returning ? "is-returning" : ""}`} role="slider" tabIndex={0} aria-label="Rueda rotaria interactiva" aria-valuemin={0} aria-valuemax={359} aria-valuenow={((rotation % 360) + 360) % 360} aria-valuetext={`${rotation} grados`} title="Desliza el borde para girar"
    onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={rotateWithKeyboard} onContextMenu={(event) => event.preventDefault()}>
    <span className="interactive-wheel-face" style={{ transform: `rotate(${rotation}deg)` }}><RotaryWheel /></span>
  </div>;
}
