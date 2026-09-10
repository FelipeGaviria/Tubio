"use client";

import { useId } from "react";

/** Use the existing favicon silhouette without its colored square. */
export function RotaryWheel({ decorative = false }: { decorative?: boolean }) {
  const id = useId().replace(/:/g, "");
  return <svg className="rotary-wheel" viewBox="45 45 422 422" aria-hidden={decorative || undefined} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : "Rueda rotaria"}>
    <defs>
      <filter id={`${id}-isolate`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 1.14 0 0 -0.14"/></filter>
      <mask id={`${id}-wheel`} style={{ maskType: "alpha" }} x="0" y="0" width="512" height="512"><image href="/icons/rotaract/icon-512.png" width="512" height="512" filter={`url(#${id}-isolate)`}/></mask>
    </defs>
    <rect width="512" height="512" fill="currentColor" mask={`url(#${id}-wheel)`}/>
  </svg>;
}
