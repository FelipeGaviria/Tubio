"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Mark = "present" | "virtual" | "absent" | "excused";
type Kind = "normal" | "cancelled" | "na";
type Member = { id: string; name: string; joined: string; retired?: string };
type Session = { date: string; kind: Kind; marks: Record<string, Mark> };
type Data = { members: Member[]; sessions: Session[] };
const KEY = "tubio-toastmasters-attendance-v1";
const choices: { value: Mark; label: string; short: string }[] = [
  { value: "present", label: "Vino presencial", short: "Presencial" },
  { value: "virtual", label: "Vino virtual", short: "Virtual" },
  { value: "absent", label: "No asistió, sin razón", short: "No asistió" },
  { value: "excused", label: "No asistió o no aplica", short: "No aplica" },
];
const toIso = (d: Date) => d.toISOString().slice(0, 10);
function monday() { const d = new Date(); const day = d.getDay(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); return d; }
function shift(date: string, weeks: number) { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + weeks * 7); return toIso(d); }
function pretty(date: string, compact = false) { const text = new Intl.DateTimeFormat("es-CO", compact ? { day: "numeric", month: "short" } : { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`)); return text[0].toUpperCase() + text.slice(1); }
function starter(): Data {
  const now = toIso(monday()), dates = [-3, -2, -1, 0].map((n) => shift(now, n));
  const members: Member[] = [{ id: "ana", name: "Ana Martínez", joined: dates[0] }, { id: "carlos", name: "Carlos Restrepo", joined: dates[0] }, { id: "laura", name: "Laura Gómez", joined: dates[0] }, { id: "miguel", name: "Miguel Torres", joined: dates[1] }];
  const samples: Record<string, Mark>[] = [
    { ana: "present", carlos: "present", laura: "virtual" },
    { ana: "present", carlos: "absent", laura: "virtual", miguel: "present" },
    { ana: "virtual", carlos: "absent", laura: "present", miguel: "excused" },
    { ana: "present", carlos: "excused", laura: "present", miguel: "virtual" },
  ];
  return { members, sessions: dates.map((date, i) => ({ date, kind: "normal", marks: samples[i] })) };
}
function Icon({ name }: { name: "left" | "right" | "plus" | "people" | "calendar" | "close" | "trash" }) {
  const p = { left: <path d="m15 18-6-6 6-6" />, right: <path d="m9 18 6-6-6-6" />, plus: <path d="M12 5v14M5 12h14" />, people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /></>, calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>, close: <path d="m6 6 12 12M18 6 6 18" />, trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" /></> };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{p[name]}</svg>;
}

export function AttendanceApp() {
  const [data, setData] = useState<Data | null>(null);
  const [date, setDate] = useState(toIso(monday()));
  const [name, setName] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [allDates, setAllDates] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { try { const saved = localStorage.getItem(KEY); setData(saved ? JSON.parse(saved) : starter()); } catch { setData(starter()); } }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (data) localStorage.setItem(KEY, JSON.stringify(data)); }, [data]);
  const ordered = useMemo(() => [...(data?.sessions ?? [])].sort((a, b) => a.date.localeCompare(b.date)), [data]);
  const session = data?.sessions.find((s) => s.date === date);
  const members = data?.members.filter((m) => m.joined <= date && (!m.retired || m.retired > date)) ?? [];
  function go(next: string) { setDate(next); setData((d) => d && (d.sessions.some((s) => s.date === next) ? d : { ...d, sessions: [...d.sessions, { date: next, kind: "normal", marks: {} }] })); }
  function editSession(patch: Partial<Session>) { setData((d) => d && ({ ...d, sessions: d.sessions.map((s) => s.date === date ? { ...s, ...patch } : s) })); }
  function setMark(id: string, mark: Mark) { if (session?.kind === "normal") editSession({ marks: { ...session.marks, [id]: mark } }); }
  function add(e: FormEvent) { e.preventDefault(); const clean = name.trim(); if (!clean) return; setData((d) => d && ({ ...d, members: [...d.members, { id: `${Date.now()}-${Math.random()}`, name: clean, joined: date }] })); setName(""); }
  function streak(id: string) { let n = 0; for (const s of ordered.filter((x) => x.date <= date && x.kind === "normal").reverse()) { const mark = s.marks[id]; if (mark === "absent") n++; else if (!mark || mark === "excused") continue; else break; } return n; }
  const level = (id: string) => streak(id) >= 3 ? "danger" : streak(id) >= 2 ? "warning" : "active";
  function retire(id: string) { setData((d) => d && ({ ...d, members: d.members.map((m) => m.id === id ? { ...m, retired: date } : m) })); setProfileId(null); }
  if (!data || !session) return <main className="attendance-page"><div className="attendance-loading">Preparando tus sesiones…</div></main>;
  const profile = data.members.find((m) => m.id === profileId);
  const count = (mark: Mark) => members.filter((m) => (session.marks[m.id] ?? "excused") === mark).length;
  return <main className="attendance-page">
    <header className="attendance-topbar"><Link href="/" className="attendance-logo"><span>TM</span><div><strong>Toastmasters</strong><small>Club de oratoria</small></div></Link><div className="autosave"><span /> Guardado automático</div></header>
    <div className="attendance-layout">
      <aside className="attendance-sidebar">
        <div className="sidebar-app-title"><span><Icon name="people" /></span><div><strong>Acompañamiento</strong><small>de asistencias</small></div></div>
        <p className="sidebar-caption">Sesiones recientes</p>
        <div className="session-list">{(allDates ? [...ordered].reverse() : [...ordered].reverse().slice(0, 6)).map((s) => <button className={s.date === date ? "active" : ""} key={s.date} onClick={() => go(s.date)}><span><Icon name="calendar" /></span><div><strong>{pretty(s.date, true)}</strong><small>{s.kind === "normal" ? "Sesión normal" : s.kind === "cancelled" ? "No hubo sesión" : "No aplica"}</small></div></button>)}</div>
        {ordered.length > 6 && <button className="show-sessions" onClick={() => setAllDates(!allDates)}>{allDates ? "Ver menos" : "Ver todas las sesiones"}</button>}
        <div className="sidebar-note"><span>??</span><strong>Todo queda guardado</strong><p>Los cambios se conservan automáticamente en este dispositivo.</p></div>
      </aside>
      <section className="attendance-workspace">
        <div className="attendance-heading"><div><p>Control semanal</p><h1>Acompañamiento de asistencias</h1><span>Registra quién vino y detecta a tiempo a quien necesita acompañamiento.</span></div><form className="add-person" onSubmit={add}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del asistente" aria-label="Nombre del nuevo asistente" /><button><Icon name="plus" /> Agregar persona</button></form></div>
        <div className="session-card"><div className="session-date-control"><button onClick={() => go(shift(date, -1))} aria-label="Sesión anterior"><Icon name="left" /></button><div><span>Sesión del lunes</span><strong>{pretty(date)}</strong></div><button onClick={() => go(shift(date, 1))} aria-label="Sesión siguiente"><Icon name="right" /></button></div><div className="session-kind">{([['normal','Sesión normal'],['cancelled','No hubo sesión'],['na','No aplica']] as [Kind,string][]).map(([value,label]) => <button key={value} className={session.kind === value ? "active" : ""} onClick={() => editSession({ kind: value })}>{label}</button>)}</div></div>
        {session.kind !== "normal" ? <div className="no-session"><span>?</span><h2>{session.kind === "cancelled" ? "Esta semana no hubo sesión" : "Esta fecha no aplica"}</h2><p>No se sumarán asistencias ni ausencias al historial.</p></div> : <>
          <div className="attendance-summary"><div><strong>{members.length}</strong><span>Personas</span></div><div className="present"><i /><strong>{count("present")}</strong><span>Presencial</span></div><div className="virtual"><i /><strong>{count("virtual")}</strong><span>Virtual</span></div><div className="absent"><i /><strong>{count("absent")}</strong><span>Sin asistir</span></div></div>
          <div className="people-card"><div className="people-card-title"><div><h2>Asistentes</h2><p>Toca un estado para actualizarlo. Toca el nombre para ver su historial.</p></div><span>{members.length} registrados</span></div><div className="people-list">{members.map((m) => { const selected = session.marks[m.id] ?? "excused", risk = level(m.id); return <article className="person-row" key={m.id}><button className="person-identity" onClick={() => setProfileId(m.id)}><span className={`avatar ${risk}`}>{m.name.split(" ").map((p) => p[0]).slice(0,2).join("")}</span><div><strong>{m.name}</strong><small className={risk}>{risk === "danger" ? "Necesita acompañamiento" : risk === "warning" ? "Atención" : "Activo"}</small></div></button><div className="attendance-options">{choices.map((c) => <button key={c.value} className={`${c.value} ${selected === c.value ? "selected" : ""}`} onClick={() => setMark(m.id,c.value)} title={c.label}><i>{selected === c.value ? "?" : ""}</i><span>{c.short}</span></button>)}</div></article>; })}{!members.length && <div className="empty-people">Agrega la primera persona para comenzar.</div>}</div></div>
        </>}
      </section>
    </div>
    {profile && <div className="profile-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setProfileId(null)}><aside className="profile-panel" role="dialog" aria-modal="true"><button className="profile-close" onClick={() => setProfileId(null)}><Icon name="close" /></button><div className="profile-header"><span className={`avatar large ${level(profile.id)}`}>{profile.name.split(" ").map((p) => p[0]).slice(0,2).join("")}</span><p>Historial del asistente</p><h2>{profile.name}</h2><small>Desde {pretty(profile.joined,true)}</small></div><div className="profile-stats"><div><strong>{ordered.filter((s) => s.kind === "normal" && ["present","virtual"].includes(s.marks[profile.id])).length}</strong><span>Asistencias</span></div><div><strong>{streak(profile.id)}</strong><span>Ausencias seguidas</span></div></div><div className="history-list">{[...ordered].reverse().filter((s) => s.date >= profile.joined && (!profile.retired || s.date < profile.retired)).map((s) => { const mark = s.kind === "normal" ? (s.marks[profile.id] ?? "excused") : null; return <div key={s.date}><span className={mark ?? "skipped"}>{mark ? "?" : "—"}</span><div><strong>{pretty(s.date,true)}</strong><small>{s.kind === "normal" ? choices.find((c) => c.value === mark)?.label : s.kind === "cancelled" ? "No hubo sesión" : "No aplica"}</small></div></div>})}</div><button className="retire-person" onClick={() => retire(profile.id)}><Icon name="trash" /> Retirar desde esta sesión</button><p className="retire-note">Su historial se conserva, pero no aparecerá en esta sesión ni en las siguientes.</p></aside></div>}
  </main>;
}