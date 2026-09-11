"use client";

import { RotaractHomeButton } from "@/components/RotaractHomeButton";

export type RotaractSection = "fechas" | "asistencias" | "tesoreria" | "inicio" | "varios";
export const rotaractSections = [
  { id: "fechas", label: "Fechas" },
  { id: "tesoreria", label: "Tesorería" },
  { id: "inicio", label: "Inicio" },
  { id: "asistencias", label: "Asistencias" },
  { id: "varios", label: "Varios" },
] as const;

export function RotaractNavigation({ section, onSelect, unlocked, onEdit }: { section: RotaractSection; onSelect: (section: RotaractSection) => void; unlocked: boolean; onEdit: () => void }) {
  return <nav className="rotaract-navigation" aria-label="Secciones de Rotaract">
    {rotaractSections.map(({ id, label }) => id === "inicio" ? <RotaractHomeButton key={id} active={section === "inicio"} unlocked={unlocked} onNavigate={() => onSelect("inicio")} onEdit={onEdit} /> : <a key={id} href={`#${id}`} aria-current={section === id ? "page" : undefined} onClick={() => onSelect(id)}>
      {<svg aria-hidden="true" viewBox="0 0 24 24">{id === "fechas" ? <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h3m3 0h3"/></> : id === "asistencias" ? <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-10 2 2 4-4"/></> : id === "tesoreria" ? <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-6 5h6"/><circle cx="16" cy="14" r=".5"/></> : id === "varios" ? <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></> : <><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/></>}</svg>}
      <span>{label}</span>
    </a>)}
  </nav>;
}
