"use client";

import { useState } from "react";

import type { Minutes } from "@/lib/rotaract-minutes";
export type { Minutes } from "@/lib/rotaract-minutes";

export function MeetingMinutes({ value, editable, onChange }: { value?: Minutes; editable: boolean; onChange: (value: Minutes) => void }) {
  const [open, setOpen] = useState(false);
  const minutes = value ?? { title: "", notes: "", points: [], responsibilities: [] };
  return <section className="meeting-minutes">
    <button type="button" className="minutes-toggle" aria-expanded={open} aria-controls="minutes-editor" onClick={() => setOpen(!open)}>Actas <span>{open ? "−" : "+"}</span></button>
    {open && <div id="minutes-editor" className="minutes-editor">
      <p>{editable ? "Escribe el acta de esta reunión. Los cambios se guardan automáticamente y se incluyen en el PDF." : "Acta de la reunión seleccionada. Activa el modo edición para crearla o modificarla."}</p>
      {!value && editable && <button type="button" onClick={() => onChange({ ...minutes, title: "Acta de reunión" })}>Crear acta</button>}
      {value ? <>
        <label>Título<input disabled={!editable} value={minutes.title} onChange={(event) => onChange({ ...minutes, title: event.target.value })}/></label>
        <label>Notas de la reunión<textarea rows={4} disabled={!editable} value={minutes.notes} placeholder="¿Qué conversamos y qué acordamos?" onChange={(event) => onChange({ ...minutes, notes: event.target.value })}/></label>
        {([ ["points", "Puntos", "punto"], ["responsibilities", "Responsabilidades", "responsabilidad"] ] as const).map(([field, label, singular]) => <fieldset key={field}>
          <legend>{label}</legend>
          {minutes[field].map((entry, index) => <div className="minutes-entry" key={index}><label>{singular === "punto" ? "Punto" : "Responsabilidad"} {index + 1}<textarea rows={3} disabled={!editable} value={entry} placeholder={field === "points" ? "Describe el tema y las decisiones…" : "Escribe la tarea, quién se encarga y para cuándo…"} onChange={(event) => onChange({ ...minutes, [field]: minutes[field].map((item, position) => position === index ? event.target.value : item) })}/></label>{editable && <button type="button" aria-label={`Eliminar ${singular} ${index + 1}`} onClick={() => onChange({ ...minutes, [field]: minutes[field].filter((_, position) => position !== index) })}>Eliminar</button>}</div>)}
          {editable && <button type="button" onClick={() => onChange({ ...minutes, [field]: [...minutes[field], ""] })}>+ Agregar {singular}</button>}
        </fieldset>)}
      </> : !editable && <p>Todavía no hay un acta para esta fecha.</p>}
    </div>}
  </section>;
}
