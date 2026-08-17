"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Mark = "present" | "virtual" | "absent" | "excused";
type Kind = "normal" | "cancelled" | "virtual" | "na";
type Member = { id: string; name: string; joined: string; retired?: string };
type Session = { date: string; kind: Kind; marks: Record<string, Mark>; extraordinary?: boolean };
type Data = { members: Member[]; sessions: Session[] };
const KEY = "tubio-toastmasters-attendance-v2";
const ACCESS_KEY = "tubio-attendance-access-until";
const ACCESS_DURATION = 2 * 60 * 60 * 1000;
const SYNC_URL = "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/attendance-sync";
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
  const now = toIso(monday());
  return { members: [], sessions: [{ date: now, kind: "normal", marks: {} }] };
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
  const [unlocked, setUnlocked] = useState(false);
  const [accessReady, setAccessReady] = useState(false);
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [cloudReady, setCloudReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "saving" | "saved" | "error">("connecting");
  const [shared, setShared] = useState(false);
  const remoteStamp = useRef("");
  const applyingRemote = useRef(false);
  const dataRef = useRef<Data | null>(null);
  const dataLoaded = data !== null;
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { const timer = window.setTimeout(() => { try { const saved = localStorage.getItem(KEY); setData(saved ? JSON.parse(saved) : starter()); } catch { setData(starter()); } }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (data) localStorage.setItem(KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { const timer = window.setTimeout(() => { const until = Number(localStorage.getItem(ACCESS_KEY) ?? 0); setUnlocked(until > Date.now()); setAccessReady(true); }, 0); return () => window.clearTimeout(timer); }, []);
  function grantAccess() { localStorage.setItem(ACCESS_KEY, String(Date.now() + ACCESS_DURATION)); setUnlocked(true); setAccessError(false); }
  useEffect(() => {
    if (!unlocked || !dataLoaded) return;
    let active = true;
    async function readCloud(initial = false) {
      try {
        const response = await fetch(SYNC_URL, { headers: { "x-attendance-pin": "1234" }, cache: "no-store" });
        if (!response.ok) throw new Error("No fue posible sincronizar");
        const remote = await response.json() as { data: Data; updated_at: string } | null;
        if (!active || !remote) return;
        const localData = dataRef.current;
        if (initial && remote.data.members.length === 0 && localData && localData.members.length > 0) {
          setCloudReady(true);
          setSyncStatus("saving");
          return;
        }
        if (remote.updated_at !== remoteStamp.current) {
          remoteStamp.current = remote.updated_at;
          applyingRemote.current = true;
          setData(remote.data);
        }
        setCloudReady(true);
        setSyncStatus("saved");
      } catch {
        if (active) setSyncStatus("error");
      }
    }
    void readCloud(true);
    const interval = window.setInterval(() => void readCloud(), 4000);
    return () => { active = false; window.clearInterval(interval); };
  }, [unlocked, dataLoaded]);
  useEffect(() => {
    if (!cloudReady || !data) return;
    if (applyingRemote.current) { applyingRemote.current = false; return; }
    setSyncStatus("saving");
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(SYNC_URL, { method: "POST", headers: { "Content-Type": "application/json", "x-attendance-pin": "1234" }, body: JSON.stringify({ data }) });
        if (!response.ok) throw new Error("No fue posible guardar");
        const saved = await response.json() as { updated_at?: string } | null;
        if (saved?.updated_at) remoteStamp.current = saved.updated_at;
        setSyncStatus("saved");
      } catch { setSyncStatus("error"); }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [data, cloudReady]);
  const ordered = useMemo(() => [...(data?.sessions ?? [])].sort((a, b) => a.date.localeCompare(b.date)), [data]);
  const session = data?.sessions.find((s) => s.date === date);
  const members = data?.members.filter((m) => m.joined <= date && (!m.retired || m.retired > date)) ?? [];
  function go(next: string) { setDate(next); setData((d) => d && (d.sessions.some((s) => s.date === next) ? d : { ...d, sessions: [...d.sessions, { date: next, kind: "normal", marks: {} }] })); }
  const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;
  const future = date > today;
  function editSession(patch: Partial<Session>) { if (future) return; setData((d) => d && ({ ...d, sessions: d.sessions.map((s) => s.date === date ? { ...s, ...patch } : s) })); }
  function changeKind(kind: Exclude<Kind, "na">) {
    if (!session || future) return;
    const marks = kind === "virtual"
      ? Object.fromEntries(Object.entries(session.marks).map(([id, mark]) => [id, mark === "present" ? "virtual" : mark])) as Record<string, Mark>
      : session.marks;
    editSession({ kind, marks, extraordinary: kind === "cancelled" ? false : session.extraordinary });
  }
  function setMark(id: string, mark: Mark) {
    if (!session || !["normal", "virtual"].includes(session.kind) || (session.kind === "virtual" && mark === "present")) return;
    editSession({ marks: { ...session.marks, [id]: mark } });
  }
  function add(e: FormEvent) { e.preventDefault(); if (future) return; const clean = name.trim(); if (!clean) return; setData((d) => d && ({ ...d, members: [...d.members, { id: `${Date.now()}-${Math.random()}`, name: clean, joined: date }] })); setName(""); }
  function streak(id: string) { let n = 0; for (const s of ordered.filter((x) => x.date <= date && ["normal", "virtual"].includes(x.kind)).reverse()) { const mark = s.marks[id]; if (mark === "absent") { if (!s.extraordinary) n += s.kind === "virtual" ? 0.5 : 1; } else if (!mark || mark === "excused") continue; else break; } return n; }
  function attendancePoints(id: string) { return ordered.reduce((total, s) => total + (["normal", "virtual"].includes(s.kind) && ["present", "virtual"].includes(s.marks[id]) ? (s.kind === "virtual" ? 0.75 : 1) : 0), 0); }
  function formatPoints(value: number) { return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, ""); }
  const level = (id: string) => streak(id) >= 3 ? "danger" : streak(id) >= 2 ? "warning" : "active";
  function rename(id: string, nextName: string) { setData((d) => d && ({ ...d, members: d.members.map((m) => m.id === id ? { ...m, name: nextName } : m) })); }
  function retire(id: string) { if (future) return; setData((d) => d && ({ ...d, members: d.members.map((m) => m.id === id ? { ...m, retired: date } : m) })); setProfileId(null); }
  if (!accessReady) return <main className="attendance-lock"><div className="lock-loading">Verificando acceso…</div></main>;
  if (!unlocked) return <main className="attendance-lock"><form onSubmit={(e) => { e.preventDefault(); if (password === "1234") grantAccess(); else { setAccessError(true); setPassword(""); } }}><div className="lock-mark">TM</div><p>Acceso privado</p><h1>Asistencia a Sesiones</h1><span>Ingresa la contraseña para consultar o editar las sesiones. El acceso se recordará durante 2 horas.</span><label>Contraseña<input autoFocus type="password" inputMode="numeric" maxLength={4} value={password} onChange={(e) => { const next = e.target.value; setPassword(next); setAccessError(false); if (next === "1234") grantAccess(); else if (next.length === 4) setAccessError(true); }} placeholder="••••" aria-invalid={accessError} /></label>{accessError && <small>La contraseña no es correcta.</small>}<button type="submit">Entrar al aplicativo</button><Link href="/">Volver a TuBio</Link></form></main>;
  if (!data || !session) return <main className="attendance-page"><div className="attendance-loading">Preparando tus sesiones…</div></main>;
  async function shareApp() {
    const shareData = { title: "Asistencia a Sesiones", text: "Registro de asistencia de las sesiones de Toastmasters", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch { /* El usuario puede cerrar el menú de compartir. */ }
  }
  const profile = data.members.find((m) => m.id === profileId);
  const count = (mark: Mark) => members.filter((m) => (session.marks[m.id] ?? "excused") === mark).length;
  return <main className="attendance-page">
    <header className="attendance-topbar"><div className="attendance-logo" aria-label="Toastmasters"><span>TM</span><div><strong>Toastmasters</strong><small>Club de oratoria</small></div></div><div className="attendance-top-actions"><button className="share-attendance" type="button" onClick={shareApp} aria-label="Compartir enlace"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg><span>{shared ? "¡Copiado!" : "Compartir"}</span></button><div className={`autosave ${syncStatus}`}><span /> {syncStatus === "connecting" ? "Conectando…" : syncStatus === "saving" ? "Guardando…" : syncStatus === "error" ? "Sin conexión" : "Sincronizado"}</div></div></header>
    <div className="attendance-layout">
      <aside className="attendance-sidebar">
        <div className="sidebar-app-title"><span><Icon name="people" /></span><div><strong>Asistencia</strong><small>a sesiones</small></div></div>
        <p className="sidebar-caption">Sesiones recientes</p>
        <div className="session-list">{(allDates ? [...ordered].reverse() : [...ordered].reverse().slice(0, 6)).map((s) => <button className={s.date === date ? "active" : ""} key={s.date} onClick={() => go(s.date)}><span><Icon name="calendar" /></span><div><strong>{pretty(s.date, true)}</strong><small>{s.kind === "normal" ? "Sesión normal" : s.kind === "virtual" ? "Sesión virtual" : "No hubo sesión"}{s.extraordinary ? " · Extraordinaria" : ""}</small></div></button>)}</div>
        {ordered.length > 6 && <button className="show-sessions" onClick={() => setAllDates(!allDates)}>{allDates ? "Ver menos" : "Ver todas las sesiones"}</button>}
        <div className="sidebar-note"><span>✓</span><strong>Todo queda guardado</strong><p>Los cambios se sincronizan automáticamente entre tus dispositivos.</p></div>
      </aside>
      <section className="attendance-workspace">
        <div className="attendance-heading"><div><p>Control semanal</p><h1>Asistencia a Sesiones</h1><span>Registra quién vino y detecta a tiempo a quien necesita acompañamiento.</span></div><form className="add-person" onSubmit={add}><input disabled={future} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del asistente" aria-label="Nombre del nuevo asistente" /><button disabled={future}><Icon name="plus" /> Agregar persona</button></form></div>
        <div className="session-card"><div className="session-date-control"><button onClick={() => go(shift(date, -1))} aria-label="Sesión anterior"><Icon name="left" /></button><div><span>Sesión del lunes</span><strong>{pretty(date)}</strong></div><button onClick={() => go(shift(date, 1))} aria-label="Sesión siguiente"><Icon name="right" /></button></div><div className="session-kind">{([['normal','Sesión normal'],['cancelled','No hubo sesión'],['virtual','Virtual']] as [Exclude<Kind,"na">,string][]).map(([value,label]) => <button disabled={future} key={value} className={session.kind === value ? "active" : ""} onClick={() => changeKind(value)}>{label}</button>)}</div><label className={`extraordinary-toggle ${session.extraordinary ? "checked" : ""}`}><input type="checkbox" checked={Boolean(session.extraordinary)} disabled={future || !["normal", "virtual"].includes(session.kind)} onChange={(event) => editSession({ extraordinary: event.target.checked })} /><span>✓</span><div><strong>Sesión extraordinaria</strong><small>Festivo o asistencia excepcional</small></div></label></div>
        {future && <div className="future-lock"><span>🔒</span><div><strong>Esta sesión todavía está bloqueada</strong><p>Se habilitará automáticamente el lunes {pretty(date)}.</p></div></div>}
        {session.extraordinary && ["normal", "virtual"].includes(session.kind) && <div className="extraordinary-note"><span>★</span><div><strong>Sesión extraordinaria activa</strong><p>Las ausencias de esta fecha no afectarán el estado ni los patrones de los socios.</p></div></div>}
        {!["normal", "virtual"].includes(session.kind) ? <div className="no-session"><span>—</span><h2>Esta semana no hubo sesión</h2><p>No se sumarán asistencias ni ausencias al historial.</p></div> : <>
          <div className="attendance-summary"><div><strong>{members.length}</strong><span>Personas</span></div><div className="present"><i /><strong>{count("present")}</strong><span>Presencial</span></div><div className="virtual"><i /><strong>{count("virtual")}</strong><span>Virtual</span></div><div className="absent"><i /><strong>{count("absent")}</strong><span>Sin asistir</span></div></div>
          <div className="people-card"><div className="people-card-title"><div><h2>Asistentes</h2><p>{session.kind === "virtual" ? "Esta sesión solo permite asistencia virtual." : "Toca un estado para actualizarlo."} Toca el nombre para ver su historial.</p></div><span>{members.length} registrados</span></div><div className="people-list">{members.map((m) => { const selected = session.marks[m.id] ?? "excused", risk = level(m.id); return <article className="person-row" key={m.id}><button className="person-identity" onClick={() => setProfileId(m.id)}><span className={`avatar ${risk}`}>{m.name.split(" ").map((p) => p[0]).slice(0,2).join("")}</span><div><strong>{m.name}</strong><small className={risk}>{risk === "danger" ? "Necesita acompañamiento" : risk === "warning" ? "Atención" : "Activo"}</small></div></button><div className="attendance-options">{choices.map((c) => { const unavailable = session.kind === "virtual" && c.value === "present"; return <button key={c.value} disabled={future || unavailable} className={`${c.value} ${selected === c.value ? "selected" : ""} ${unavailable ? "unavailable" : ""}`} onClick={() => setMark(m.id,c.value)} title={unavailable ? "No disponible en sesiones virtuales" : c.label}><i>{selected === c.value ? "✓" : ""}</i><span>{c.short}</span></button>; })}</div></article>; })}{!members.length && <div className="empty-people">Agrega la primera persona para comenzar.</div>}</div></div>
        </>}
      </section>
    </div>
    {profile && <div className="profile-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setProfileId(null)}><aside className="profile-panel" role="dialog" aria-modal="true"><button className="profile-close" onClick={() => setProfileId(null)}><Icon name="close" /></button><div className="profile-header"><span className={`avatar large ${level(profile.id)}`}>{profile.name.split(" ").map((p) => p[0]).slice(0,2).join("")}</span><p>Historial del asistente</p><input className="profile-name-input" value={profile.name} onChange={(e) => rename(profile.id, e.target.value)} aria-label="Editar nombre" /><small>Desde {pretty(profile.joined,true)}</small></div><div className="profile-stats"><div><strong>{formatPoints(attendancePoints(profile.id))}</strong><span>Puntos de asistencia</span></div><div><strong>{formatPoints(streak(profile.id))}</strong><span>Ausencias ponderadas</span></div></div><div className="history-list">{[...ordered].reverse().filter((s) => s.date >= profile.joined && (!profile.retired || s.date < profile.retired)).map((s) => { const activeSession = ["normal", "virtual"].includes(s.kind); const mark = activeSession ? (s.marks[profile.id] ?? "excused") : null; const detail = activeSession ? `${s.kind === "virtual" ? "Sesión virtual · " : ""}${s.extraordinary ? "Extraordinaria · " : ""}${choices.find((c) => c.value === mark)?.label}` : "No hubo sesión"; return <div key={s.date}><span className={mark ?? "skipped"}>{mark ? "✓" : "—"}</span><div><strong>{pretty(s.date,true)}</strong><small>{detail}</small></div></div>})}</div><button disabled={future} className="retire-person" onClick={() => retire(profile.id)}><Icon name="trash" /> Retirar desde esta sesión</button><p className="retire-note">Su historial se conserva, pero no aparecerá en esta sesión ni en las siguientes.</p></aside></div>}
  </main>;
}
