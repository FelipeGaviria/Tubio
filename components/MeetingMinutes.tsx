"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { Minutes } from "@/lib/rotaract-minutes";
export type { Minutes } from "@/lib/rotaract-minutes";

export function MeetingMinutes({ value, editable, dirty, saving, onChange, onRequestEdit, onSave }: { value?: Minutes; editable: boolean; dirty: boolean; saving: boolean; onChange: (value: Minutes) => void; onRequestEdit: () => void; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const minutes = value ?? { title: "", notes: "", points: [], responsibilities: [] };
  const update = (patch: Partial<Minutes>) => onChange({ ...minutes, title: minutes.title || "Acta de reunión", ...patch });
  const editor = <div className="minutes-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <section className="minutes-modal" role="dialog" aria-modal="true" aria-labelledby="minutes-title">
      <header><strong id="minutes-title">Acta de la reunión</strong><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar acta">×</button></header>
      <div className="minutes-editor">
        <p>{editable ? "Escribe el acta y guarda los cambios cuando termines." : "Desbloquea la edición para crearla o modificarla."}</p>
        {!editable && <button type="button" className="minutes-primary-action" onClick={onRequestEdit}>{value ? "Editar acta" : "Crear acta"}</button>}
        <label>Título<input disabled={!editable} value={minutes.title} placeholder="Acta de reunión" onChange={(event) => update({ title: event.target.value })}/></label>
        <label>Notas de la reunión<textarea rows={4} disabled={!editable} value={minutes.notes} placeholder="¿Qué conversamos y qué acordamos?" onChange={(event) => update({ notes: event.target.value })}/></label>
        {([ ["points", "Puntos", "punto"], ["responsibilities", "Responsabilidades", "responsabilidad"] ] as const).map(([field, label, singular]) => <fieldset key={field}>
          <legend>{label}</legend>
          {minutes[field].map((entry, index) => <div className="minutes-entry" key={index}><label>{singular === "punto" ? "Punto" : "Responsabilidad"} {index + 1}<textarea rows={3} disabled={!editable} value={entry} placeholder={field === "points" ? "Describe el tema y las decisiones…" : "Escribe la tarea, quién se encarga y para cuándo…"} onChange={(event) => update({ [field]: minutes[field].map((item, position) => position === index ? event.target.value : item) })}/></label>{editable && <button type="button" aria-label={`Eliminar ${singular} ${index + 1}`} onClick={() => update({ [field]: minutes[field].filter((_, position) => position !== index) })}>Eliminar</button>}</div>)}
          {!minutes[field].length && <p className="minutes-empty">Todavía no hay {label.toLocaleLowerCase("es")}.</p>}
          {editable && <button type="button" onClick={() => update({ [field]: [...minutes[field], ""] })}>+ Agregar {singular}</button>}
        </fieldset>)}
      </div>
      {editable && <footer><button type="button" disabled={!dirty || saving} onClick={onSave}>{saving ? "Guardando…" : "Guardar acta"}</button></footer>}
    </section>
  </div>;
  return <section className="meeting-minutes">
    <button type="button" className="minutes-toggle" aria-expanded={open} onClick={() => setOpen(true)}>Actas <span>+</span></button>
    {open && createPortal(editor, document.body)}
  </section>;
}
