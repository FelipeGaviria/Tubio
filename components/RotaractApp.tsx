"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Mark = "present" | "absent" | "excused";
type Member = { id: string; name: string; joined: string; retired?: string };
type Meeting = { date: string; held: boolean; marks: Record<string, Mark> };
type ClubEvent = { id: string; title: string; date: string; time: string; place: string; note: string };
type ClubData = { members: Member[]; sessions: Meeting[]; events: ClubEvent[] };

const STORAGE_KEY = "tubio-rotaract-state-v1";
const ACCESS_UNTIL_KEY = "tubio-rotaract-access-until";
const TOKEN_KEY = "tubio-rotaract-token";
const SYNC_URL = "https://qdxapfnjizissxgkhpxi.supabase.co/functions/v1/rotaract-sync";
const ACCESS_DURATION = 2 * 60 * 60 * 1000;
const iso = (date: Date) => date.toISOString().slice(0, 10);
const today = () => iso(new Date());
function saturday() { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 1) % 7)); return date; }
function shift(date: string, days: number) { const next = new Date(`${date}T12:00:00`); next.setDate(next.getDate() + days); return iso(next); }
function pretty(date: string, short = false) { const value = new Intl.DateTimeFormat("es-CO", short ? { day: "numeric", month: "short" } : { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`)); return value[0].toUpperCase() + value.slice(1); }
function initialData(): ClubData { const date = iso(saturday()); return { members: [], sessions: [{ date, held: true, marks: {} }], events: [] }; }
function normalizeData(value: ClubData): ClubData {
  const fallbackDate = iso(saturday());
  const members = Array.isArray(value?.members) ? value.members : [];
  const events = Array.isArray(value?.events) ? value.events : [];
  const sessions = Array.isArray(value?.sessions) ? value.sessions : [];
  return { members, events, sessions: sessions.length ? sessions : [{ date: fallbackDate, held: true, marks: {} }] };
}
function Icon({ name }: { name: "left" | "right" | "plus" | "calendar" | "people" | "trash" | "close" }) { const paths = { left: <path d="m15 18-6-6 6-6"/>, right: <path d="m9 18 6-6-6-6"/>, plus: <path d="M12 5v14M5 12h14"/>, calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>, people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>, trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6"/></>, close: <path d="m6 6 12 12M18 6 6 18"/> }; return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>; }

export function RotaractApp() {
  const [data, setData] = useState<ClubData | null>(null);
  const [date, setDate] = useState(iso(saturday()));
  const [name, setName] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [accessReady, setAccessReady] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const [token, setToken] = useState("");
  const [cloudReady, setCloudReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "saving" | "saved" | "error">("connecting");
  const [eventDraft, setEventDraft] = useState({ title: "", date: "", time: "", place: "", note: "" });
  const remoteStamp = useRef("");
  const applyingRemote = useRef(false);
  const dataRef = useRef<ClubData | null>(null);
  const dataLoaded = data !== null;

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { const timer = window.setTimeout(() => { try { const stored = localStorage.getItem(STORAGE_KEY); setData(stored ? normalizeData(JSON.parse(stored)) : initialData()); } catch { setData(initialData()); } const until = Number(localStorage.getItem(ACCESS_UNTIL_KEY) ?? 0); const storedToken = localStorage.getItem(TOKEN_KEY) ?? ""; setUnlocked(until > Date.now() && Boolean(storedToken)); setToken(storedToken); setAccessReady(true); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

  async function tryAccess(code: string) {
    if (code.length !== 4) return;
    try {
      const response = await fetch("/api/access-check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gate: "rotaract", code }) });
      const result = await response.json() as { token?: string };
      if (!response.ok || !result.token) throw new Error();
      const until = Date.now() + ACCESS_DURATION;
      localStorage.setItem(ACCESS_UNTIL_KEY, String(until)); localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token); setUnlocked(true); setAccessError(false);
    } catch { setAccessError(true); setPassword(""); }
  }

  useEffect(() => {
    if (!unlocked || !token || !dataLoaded) return;
    let active = true;
    async function readCloud(initial = false) {
      try {
        const response = await fetch(SYNC_URL, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (!response.ok) throw new Error();
        const remote = await response.json() as { data: ClubData; updated_at: string } | null;
        if (!active || !remote) return;
        const normalizedRemote = normalizeData(remote.data);
        const local = dataRef.current;
        if (initial && remote.data.members.length === 0 && remote.data.events.length === 0 && local && (local.members.length || local.events.length)) { setCloudReady(true); setSyncStatus("saving"); return; }
        if (remote.data.sessions.length === 0) { setData(normalizedRemote); setCloudReady(true); setSyncStatus("saving"); return; }
        if (remote.updated_at !== remoteStamp.current) { remoteStamp.current = remote.updated_at; applyingRemote.current = true; setData(normalizedRemote); }
        setCloudReady(true); setSyncStatus("saved");
      } catch { if (active) setSyncStatus("error"); }
    }
    void readCloud(true); const timer = window.setInterval(() => void readCloud(), 4000);
    return () => { active = false; window.clearInterval(timer); };
  }, [unlocked, token, dataLoaded]);

  useEffect(() => {
    if (!cloudReady || !data || !token) return;
    if (applyingRemote.current) { applyingRemote.current = false; return; }
    setSyncStatus("saving");
    const timer = window.setTimeout(async () => { try { const response = await fetch(SYNC_URL, { method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ data }) }); if (!response.ok) throw new Error(); const saved = await response.json() as { updated_at?: string }; if (saved.updated_at) remoteStamp.current = saved.updated_at; setSyncStatus("saved"); } catch { setSyncStatus("error"); } }, 500);
    return () => window.clearTimeout(timer);
  }, [data, cloudReady, token]);

  const meetings = useMemo(() => [...(data?.sessions ?? [])].sort((a, b) => a.date.localeCompare(b.date)), [data]);
  const meeting = data?.sessions.find((item) => item.date === date);
  const members = (data?.members.filter((member) => member.joined <= date && (!member.retired || member.retired > date)) ?? []).sort((a, b) => a.name.localeCompare(b.name, "es"));
  const upcoming = [...(data?.events ?? [])].filter((event) => event.date >= today()).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  function go(next: string) { setDate(next); setData((current) => current && (current.sessions.some((item) => item.date === next) ? current : { ...current, sessions: [...current.sessions, { date: next, held: true, marks: {} }] })); }
  function editMeeting(patch: Partial<Meeting>) { setData((current) => current && ({ ...current, sessions: current.sessions.map((item) => item.date === date ? { ...item, ...patch } : item) })); }
  function addMember(event: FormEvent) { event.preventDefault(); const clean = name.trim(); if (!clean) return; setData((current) => current && ({ ...current, members: [...current.members, { id: crypto.randomUUID(), name: clean, joined: date }] })); setName(""); }
  function setMark(id: string, mark: Mark) { if (!meeting?.held || date > today()) return; editMeeting({ marks: { ...meeting.marks, [id]: mark } }); }
  function absenceRun(id: string) { let count = 0; for (const item of meetings.filter((entry) => entry.date <= date && entry.held).reverse()) { const mark = item.marks[id]; if (mark === "absent") count += 1; else if (mark === "present") break; } return count; }
  function level(id: string) { return absenceRun(id) >= 3 ? "danger" : absenceRun(id) >= 2 ? "warning" : "active"; }
  function addEvent(event: FormEvent) { event.preventDefault(); if (!eventDraft.title.trim() || !eventDraft.date) return; setData((current) => current && ({ ...current, events: [...current.events, { id: crypto.randomUUID(), ...eventDraft, title: eventDraft.title.trim() }] })); setEventDraft({ title: "", date: "", time: "", place: "", note: "" }); }
  function removeEvent(id: string) { setData((current) => current && ({ ...current, events: current.events.filter((event) => event.id !== id) })); }
  const profile = data?.members.find((member) => member.id === profileId);
  const count = (mark: Mark) => members.filter((member) => (meeting?.marks[member.id] ?? "excused") === mark).length;

  if (!accessReady) return <main className="attendance-lock rotaract-lock"><div>Verificando acceso…</div></main>;
  if (!unlocked) return <main className="attendance-lock rotaract-lock"><form onSubmit={(event) => { event.preventDefault(); void tryAccess(password); }}><div className="lock-mark">R</div><p>Acceso del club</p><h1>Rotaract Nuevo Medellín</h1><span>Calendario y control de asistencia compartidos. El acceso se recordará durante 2 horas.</span><label>Contraseña<input autoFocus type="password" inputMode="numeric" maxLength={4} value={password} onChange={(event) => { const next = event.target.value.replace(/\D/g, ""); setPassword(next); setAccessError(false); if (next.length === 4) void tryAccess(next); }} placeholder="••••" aria-invalid={accessError}/></label>{accessError && <small>La contraseña no es correcta o el acceso está temporalmente bloqueado.</small>}<button>Entrar al aplicativo</button><Link href="/">Volver a TuBio</Link></form></main>;
  if (!data || !meeting) return <main className="attendance-page rotaract-page"><div className="attendance-loading">Preparando el club…</div></main>;

  return <main className="attendance-page rotaract-page">
    <header className="attendance-topbar"><div className="attendance-logo"><span>R</span><div><strong>Rotaract Nuevo Medellín</strong><small>Servicio · amistad · liderazgo</small></div></div><div className={`autosave ${syncStatus}`}><span/> {syncStatus === "connecting" ? "Conectando…" : syncStatus === "saving" ? "Guardando…" : syncStatus === "error" ? "Sin conexión" : "Sincronizado"}</div></header>
    <div className="attendance-layout">
      <aside className="attendance-sidebar"><div className="sidebar-app-title"><span><Icon name="people"/></span><div><strong>Rotaract</strong><small>Nuevo Medellín</small></div></div><p className="sidebar-caption">Reuniones quincenales</p><div className="session-list">{[...meetings].reverse().slice(0, 8).map((item) => <button className={item.date === date ? "active" : ""} key={item.date} onClick={() => go(item.date)}><span><Icon name="calendar"/></span><div><strong>{pretty(item.date, true)}</strong><small>{item.held ? "Reunión del club" : "No hubo reunión"}</small></div></button>)}</div><div className="sidebar-note"><span>✓</span><strong>Todo queda guardado</strong><p>Calendario y asistencias se actualizan para todos automáticamente.</p></div></aside>
      <section className="attendance-workspace">
        <div className="attendance-heading"><div><p>Club en movimiento</p><h1>Rotaract Nuevo Medellín</h1><span>Próximas fechas, socios y asistencia en un mismo lugar.</span></div><form className="add-person" onSubmit={addMember}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del socio"/><button><Icon name="plus"/> Agregar socio</button></form></div>

        <section className="rotaract-calendar"><div className="rotaract-section-title"><div><p>Lo que viene</p><h2>Próximas fechas del club</h2></div><span>{upcoming.length} programadas</span></div><div className="rotaract-events">{upcoming.map((event) => <article key={event.id}><time dateTime={event.date}><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("es-CO", { month: "short" }).format(new Date(`${event.date}T12:00:00`))}</span></time><div><h3>{event.title}</h3><p>{[event.time, event.place].filter(Boolean).join(" · ") || "Detalles por confirmar"}</p>{event.note && <small>{event.note}</small>}</div><button onClick={() => removeEvent(event.id)} aria-label={`Eliminar ${event.title}`}><Icon name="trash"/></button></article>)}{!upcoming.length && <div className="rotaract-empty-event">Aún no hay próximas fechas. Agrégalas en el formulario.</div>}</div><form className="rotaract-event-form" onSubmit={addEvent}><input value={eventDraft.title} onChange={(event) => setEventDraft({ ...eventDraft, title: event.target.value })} placeholder="Nombre del evento"/><input type="date" value={eventDraft.date} onChange={(event) => setEventDraft({ ...eventDraft, date: event.target.value })}/><input type="time" value={eventDraft.time} onChange={(event) => setEventDraft({ ...eventDraft, time: event.target.value })}/><input value={eventDraft.place} onChange={(event) => setEventDraft({ ...eventDraft, place: event.target.value })} placeholder="Lugar"/><input value={eventDraft.note} onChange={(event) => setEventDraft({ ...eventDraft, note: event.target.value })} placeholder="Nota breve"/><button><Icon name="plus"/> Agregar fecha</button></form></section>

        <div className="session-card"><div className="session-date-control"><button onClick={() => go(shift(date, -14))} aria-label="Reunión anterior"><Icon name="left"/></button><div><span>Reunión del sábado</span><strong>{pretty(date)}</strong></div><button onClick={() => go(shift(date, 14))} aria-label="Reunión siguiente"><Icon name="right"/></button></div><div className="session-kind"><button disabled={date > today()} className={meeting.held ? "active" : ""} onClick={() => editMeeting({ held: true })}>Reunión normal</button><button disabled={date > today()} className={!meeting.held ? "active" : ""} onClick={() => editMeeting({ held: false })}>No hubo reunión</button></div></div>
        {date > today() && <div className="future-lock"><span>🔒</span><div><strong>Esta reunión todavía está bloqueada</strong><p>La asistencia se habilitará el sábado correspondiente.</p></div></div>}
        {!meeting.held ? <div className="no-session"><span>—</span><h2>No hubo reunión</h2><p>Esta fecha no contará como asistencia ni ausencia.</p></div> : <><div className="attendance-summary"><div><strong>{members.length}</strong><span>Socios</span></div><div className="present"><i/><strong>{count("present")}</strong><span>Asistieron</span></div><div className="absent"><i/><strong>{count("absent")}</strong><span>No asistieron</span></div><div><strong>{count("excused")}</strong><span>No aplica</span></div></div><div className="people-card"><div className="people-card-title"><div><h2>Socios del club</h2><p>Toca el estado para actualizarlo y el nombre para consultar su historial.</p></div><span>{members.length} registrados</span></div><div className="people-list">{members.map((member) => { const selected = meeting.marks[member.id] ?? "excused"; const status = level(member.id); return <article className="person-row" key={member.id}><button className="person-identity" onClick={() => setProfileId(member.id)}><span className={`avatar ${status}`}>{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{member.name}</strong><small className={status}>{status === "danger" ? "Necesita acompañamiento" : status === "warning" ? "Atención" : "Activo"}</small></div></button><div className="attendance-options rotaract-options">{([ ["present", "Asistió"], ["absent", "No asistió"], ["excused", "No aplica"] ] as [Mark, string][]).map(([value, label]) => <button disabled={date > today()} key={value} className={`${value} ${selected === value ? "selected" : ""}`} onClick={() => setMark(member.id, value)}><i>{selected === value ? "✓" : ""}</i><span>{label}</span></button>)}</div></article>; })}{!members.length && <div className="empty-people">Agrega el primer socio para comenzar.</div>}</div></div></>}
      </section>
    </div>
    {profile && <div className="profile-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setProfileId(null)}><aside className="profile-panel"><button className="profile-close" onClick={() => setProfileId(null)}><Icon name="close"/></button><div className="profile-header"><span className={`avatar large ${level(profile.id)}`}>{profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><p>Historial del socio</p><input className="profile-name-input" value={profile.name} onChange={(event) => setData((current) => current && ({ ...current, members: current.members.map((member) => member.id === profile.id ? { ...member, name: event.target.value } : member) }))}/><small>Desde {pretty(profile.joined, true)}</small></div><div className="history-list">{[...meetings].reverse().filter((item) => item.date >= profile.joined).map((item) => { const mark = item.held ? (item.marks[profile.id] ?? "excused") : null; return <div key={item.date}><span className={mark ?? "skipped"}>{mark ? "✓" : "—"}</span><div><strong>{pretty(item.date, true)}</strong><small>{item.held ? mark === "present" ? "Asistió" : mark === "absent" ? "No asistió" : "No aplica" : "No hubo reunión"}</small></div></div>; })}</div><button className="retire-person" onClick={() => { setData((current) => current && ({ ...current, members: current.members.map((member) => member.id === profile.id ? { ...member, retired: date } : member) })); setProfileId(null); }}><Icon name="trash"/> Retirar desde esta reunión</button></aside></div>}
  </main>;
}
