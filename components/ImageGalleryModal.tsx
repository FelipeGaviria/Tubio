"use client";

import Image from "next/image";
import { useEffect } from "react";

export type GalleryItem = { src: string; alt: string };

type Props = { items: GalleryItem[]; activeIndex: number; onSelect: (index: number) => void; onClose: () => void; label: string };

export default function ImageGalleryModal({ items, activeIndex, onSelect, onClose, label }: Props) {
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.key === "ArrowLeft") onSelect((activeIndex - 1 + items.length) % items.length); if (event.key === "ArrowRight") onSelect((activeIndex + 1) % items.length); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [activeIndex, items.length, onClose, onSelect]);
  const previous = () => onSelect((activeIndex - 1 + items.length) % items.length);
  const next = () => onSelect((activeIndex + 1) % items.length);
  return <div className="raw-illustration-modal raw-gallery-modal" role="dialog" aria-modal="true" aria-label={label} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><button type="button" className="raw-gallery-close" onClick={onClose} aria-label="Cerrar galería">×</button><button type="button" className="raw-gallery-nav raw-gallery-prev" onClick={previous} aria-label="Imagen anterior">←</button><div className="raw-gallery-stage"><Image className="raw-gallery-main-image" src={items[activeIndex].src} alt={items[activeIndex].alt} fill sizes="100vw" priority /></div><button type="button" className="raw-gallery-nav raw-gallery-next" onClick={next} aria-label="Imagen siguiente">→</button><div className="raw-gallery-thumbnails" aria-label="Galería de imágenes">{items.map((item, index) => <button type="button" key={item.src} className={index === activeIndex ? "is-active" : ""} onClick={() => onSelect(index)} aria-label={`Ver ${item.alt}`}><Image src={item.src} alt="" fill sizes="110px" /></button>)}</div></div>;
}