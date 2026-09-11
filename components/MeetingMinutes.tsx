"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { AgendaItem, Minutes } from "@/lib/rotaract-minutes";
export type { Minutes } from "@/lib/rotaract-minutes";

export function MeetingMinutes({ value, editable, dirty, saving, onChange, onRequestEdit, onSave }: { value?: Minutes; editable: boolean; dirty: boolean; saving: boolean; onChange: (value: Minutes) => void; onRequestEdit: () => void; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const minutes = value ?? { title: "", agenda: [], responsibilities: [] };
  const agenda = minutes.agenda ?? (minutes.points ?? []).map((title, index) => ({ id: `legacy-${index}`, title, details: "" }));
  const update = (patch: Partial<Minutes>) => onChange({ ...minutes, title: minutes.title || "Acta de reunión", ...patch });
  const editor = <div className="minutes-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <section className="minutes-modal" role="dialog" aria-modal="true" aria-labelledby="minutes-title">
      <header><strong id="minutes-title">Acta de la reunión</strong><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar acta">×</button></header>
      <div className="minutes-editor">
        <p>{editable ? "Escribe el acta y guarda los cambios cuando termines." : "Desbloquea la edición para crearla o modificarla."}</p>
        {!editable && <button type="button" className="minutes-primary-action" onClick={onRequestEdit}>{value ? "Editar acta" : "Crear acta"}</button>}
        <label>Título<input disabled={!editable} value={minutes.title} placeholder="Acta de reunión" onChange={(event) => update({ title: event.target.value })}/></label>
        <fieldset><legend>Orden del día</legend>
          {agenda.map((item, index) => <div className="minutes-entry" key={item.id}><label>Item {index + 1}<input disabled={!editable} value={item.title} placeholder="Tema o nombre del punto" onChange={(event) => update({ agenda: agenda.map((entry) => entry.id === item.id ? { ...entry, title: event.target.value } : entry) })}/></label><label>Detalles<textarea rows={3} disabled={!editable} value={item.details} placeholder="Lo que se habló, decisiones o acuerdos…" onChange={(event) => update({ agenda: agenda.map((entry) => entry.id === item.id ? { ...entry, details: event.target.value } : entry) })}/></label>{editable && <button type="button" onClick={() => update({ agenda: agenda.filter((entry) => entry.id !== item.id) })}>Eliminar</button>}</div>)}
          {!agenda.length && <p className="minutes-empty">Agrega los temas de la reunión.</p>}
          {editable && <button type="button" onClick={() => update({ agenda: [...agenda, { id: crypto.randomUUID(), title: "", details: "" }] as AgendaItem[] })}>+ Agregar item</button>}
        </fieldset>
        <fieldset>
          <legend>Responsabilidades</legend>
          {minutes.responsibilities.map((entry, index) => <div className="minutes-entry" key={index}><label>Responsabilidad {index + 1}<textarea rows={3} disabled={!editable} value={entry} placeholder="Escribe la tarea, quién se encarga y para cuándo…" onChange={(event) => update({ responsibilities: minutes.responsibilities.map((item, position) => position === index ? event.target.value : item) })}/></label>{editable && <button type="button" aria-label={`Eliminar responsabilidad ${index + 1}`} onClick={() => update({ responsibilities: minutes.responsibilities.filter((_, position) => position !== index) })}>Eliminar</button>}</div>)}
          {!minutes.responsibilities.length && <p className="minutes-empty">Todavía no hay responsabilidades.</p>}
          {editable && <button type="button" onClick={() => update({ responsibilities: [...minutes.responsibilities, ""] })}>+ Agregar responsabilidad</button>}
        </fieldset>
      </div>
      {editable && <footer><button type="button" disabled={!dirty || saving} onClick={onSave}>{saving ? "Guardando…" : "Guardar acta"}</button></footer>}
    </section>
  </div>;
  return <section className="meeting-minutes">
    <button type="button" className="minutes-toggle" aria-expanded={open} onClick={() => setOpen(true)}>Actas <span>+</span></button>
    {open && createPortal(editor, document.body)}
  </section>;
}
