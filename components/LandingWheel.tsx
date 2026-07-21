"use client";

import type { TouchEvent } from "react";
import { useCallback, useEffect, useState } from "react";

import { site } from "@/content/site";

type WheelItem = (typeof site.landingWheel)[number];

function getSlot(index: number, activeIndex: number, total: number) {
  const offset = (index - activeIndex + total) % total;
  const lastOffset = total - 1;
  const penultimateOffset = total - 2;

  if (offset === 0) return "center";
  if (offset === 1) return "right";
  if (offset === 2) return "back";
  if (offset === 3) return "back-left";
  if (offset === penultimateOffset) return "back-left";
  if (offset === lastOffset) return "left";
  return "hidden";
}

function PreviewPattern({ item }: { item: WheelItem }) {
  return (
    <div className={`wheel-preview wheel-preview-${item.kind}`}>
      <div className="wheel-preview-orb" />
      <div className="wheel-preview-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="wheel-preview-grid">
        <span />
        <span />
        <span />
      </div>
      <div className="wheel-preview-pill">{item.kind}</div>
    </div>
  );
}

function WheelCard({ item, className }: { item: WheelItem; className: string }) {
  const children = (
    <>
      <div className="landing-wheel-shine" />
      <PreviewPattern item={item} />
      <div className="landing-wheel-label">
        <p>{item.title}</p>
        <span>{item.status}</span>
      </div>
    </>
  );

  if (item.href) {
    return (
      <a href={item.href} className={className}>
        {children}
      </a>
    );
  }

  return <article className={className}>{children}</article>;
}

export function LandingWheel() {
  const items = site.landingWheel;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % items.length);
  }, [items.length]);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(goNext, 5200);
    return () => window.clearInterval(interval);
  }, [goNext, isPaused]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
    setIsPaused(true);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) {
      setIsPaused(false);
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    setTouchStartX(null);
    setIsPaused(false);
  };

  return (
    <div
      className="landing-wheel"
      aria-label="Ruleta de tipos de landing"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="landing-wheel-arrow landing-wheel-arrow-left" type="button" aria-label="Ver landing anterior" onClick={goPrevious}>
        <span />
      </button>
      <button className="landing-wheel-arrow landing-wheel-arrow-right" type="button" aria-label="Ver siguiente landing" onClick={goNext}>
        <span />
      </button>
      <div className="landing-wheel-floor" />
      {items.map((item, index) => {
        const slot = getSlot(index, activeIndex, items.length);
        return <WheelCard key={item.title} item={item} className={`landing-wheel-card landing-wheel-card-${slot}`} />;
      })}
    </div>
  );
}