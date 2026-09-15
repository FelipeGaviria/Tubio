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
  const [tapped, setTapped] = useState(false);
  const lastAngle = useRef(0);
  const rawRotation = useRef(0);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnSounds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    returnSounds.current.forEach(clearTimeout);
  }, []);

  function clearTimers() {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    returnSounds.current.forEach(clearTimeout);
    returnSounds.current = [];
    returnTimer.current = null;
    settleTimer.current = null;
  }

  function scheduleReturn() {
    clearTimers();
    returnTimer.current = setTimeout(() => {
      setReturning(true);
      rawRotation.current = 0;
      setRotation(0);
      returnSounds.current = [0, 170, 335, 500, 665].map((delay) => setTimeout(() => tick("return"), delay));
      settleTimer.current = setTimeout(() => setReturning(false), 1100);
    }, RETURN_DELAY);
  }

  function tick(kind: "tick" | "tac" | "return" = "tick") {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(kind === "tac" ? 10 : 5);
    try {
      const Context = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Context) return;
      const context = audioContext.current ?? new Context();
      audioContext.current = context;
      const play = () => {
        const duration = kind === "tac" ? .02 : .048;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const snap = context.createOscillator();
        const snapGain = context.createGain();
        oscillator.type = "triangle";
        snap.type = "square";
        const isTap = kind === "tac";
        const isReturn = kind === "return";
        oscillator.frequency.setValueAtTime(isTap ? 190 : isReturn ? 145 : 170, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(isTap ? 110 : isReturn ? 82 : 95, context.currentTime + duration);
        gain.gain.setValueAtTime(isTap ? .12 : .1, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
        snap.frequency.setValueAtTime(isTap ? 1650 : isReturn ? 1180 : 1320, context.currentTime);
        snapGain.gain.setValueAtTime(isTap ? .055 : .045, context.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .012);
        oscillator.connect(gain).connect(context.destination);
        snap.connect(snapGain).connect(context.destination);
        oscillator.start();
        snap.start();
        oscillator.stop(context.currentTime + duration + .002);
        snap.stop(context.currentTime + .014);
      };
      if (context.state === "suspended") void context.resume().catch(() => undefined);
      play();
    } catch { /* El fidget sigue funcionando si el navegador bloquea audio. */ }
  }

  function begin(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    clearTimers();
    setReturning(false);
    tick("tac");
    setTapped(true);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setTapped(false), 260);
    setDragging(true);
    rawRotation.current = rotation;
    lastAngle.current = pointerAngle(event.currentTarget, event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || !event.isPrimary) return;
    const angle = pointerAngle(event.currentTarget, event.clientX, event.clientY);
    rawRotation.current += shortestTurn(lastAngle.current, angle) * 1.55;
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

  return <div className={`interactive-rotary-wheel ${dragging ? "is-dragging" : ""} ${returning ? "is-returning" : ""} ${tapped ? "is-tapped" : ""}`} role="slider" tabIndex={0} aria-label="Rueda rotaria interactiva" aria-valuemin={0} aria-valuemax={359} aria-valuenow={((rotation % 360) + 360) % 360} aria-valuetext={`${rotation} grados`} title="Desliza el borde para girar"
    onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={rotateWithKeyboard} onContextMenu={(event) => event.preventDefault()}>
    <span className="interactive-wheel-face" style={{ transform: `rotate(${rotation}deg)` }}><RotaryWheel /></span>
  </div>;
}
