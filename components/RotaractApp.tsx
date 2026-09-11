"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RotaractSplash } from "@/components/RotaractSplash";
import { RotaryWheel } from "@/components/RotaryWheel";
import { InteractiveRotaryWheel } from "@/components/InteractiveRotaryWheel";
import { emptyTreasury, normalizeTreasury, RotaractTreasury, type TreasuryData } from "@/components/RotaractTreasury";
import { RotaractNavigation, rotaractSections, type RotaractSection } from "@/components/RotaractNavigation";
import { ClubAppControls } from "@/components/ClubAppControls";
import { AttendanceReportButton } from "@/components/AttendanceReportButton";

import { MeetingMinutes, type Minutes } from "@/components/MeetingMinutes";
import { mergeMinutes, remainingMinutes, type MinutesDrafts } from "@/lib/rotaract-minutes";

type Mark = "present" | "absent" | "excused";
type Member = { id: string; name: string; joined: string; retired?: string; applicant?: boolean; applicantMeetings?: boolean[]; applicantWorks?: boolean[] };
type Meeting = { date: string; held: boolean; marks: Record<string, Mark>; minutes?: Minutes; reason?: string };
type ClubEvent = { id: string; title: string; date: string; time: string; place: string; note: string };
type ClubData = { members: Member[]; sessions: Meeting[]; events: ClubEvent[]; treasury: TreasuryData };

const STORAGE_KEY = "tubio-rotaract-state-v1";
const MINUTES_DRAFTS_KEY = "tubio-rotaract-minutes-drafts-v1";
const ACCESS_UNTIL_KEY = "tubio-rotaract-access-until";
const SYNC_URL = "/api/club-sync/rotaract";
const ACCESS_DURATION = 2 * 60 * 60 * 1000;
const iso = (date: Date) => date.toISOString().slice(0, 10);
const today = () => iso(new Date());
function saturday() { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 1) % 7)); return date; }
function shift(date: string, days: number) { const next = new Date(`${date}T12:00:00`); next.setDate(next.getDate() + days); return iso(next); }
function pretty(date: string, short = false) { const value = new Intl.DateTimeFormat("es-CO", short ? { day: "numeric", month: "short" } : { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`)); return value[0].toUpperCase() + value.slice(1); }
function initialData(): ClubData { const date = iso(saturday()); return { members: [], sessions: [{ date, held: true, marks: {} }], events: [], treasury: emptyTreasury() }; }
function normalizeData(value: ClubData): ClubData {
  const fallbackDate = iso(saturday());
  const members = Array.isArray(value?.members) ? value.members : [];
  const events = Array.isArray(value?.events) ? value.events : [];
  const sessions = Array.isArray(value?.sessions) ? value.sessions : [];
  return { members, events, sessions: sessions.length ? sessions : [{ date: fallbackDate, held: true, marks: {} }], treasury: normalizeTreasury(value?.treasury) };
}
function Icon({ name }: { name: "left" | "right" | "plus" | "calendar" | "people" | "trash" | "close" | "lock" | "unlock" | "edit" }) { const paths = { left: <path d="m15 18-6-6 6-6"/>, right: <path d="m9 18 6-6-6-6"/>, plus: <path d="M12 5v14M5 12h14"/>, calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>, people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>, trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6"/></>, close: <path d="m6 6 12 12M18 6 6 18"/>, lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, unlock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2.6"/></>, edit: <><path d="m4 20 4.2-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5.2 16Z"/><path d="m14.5 6.5 3 3"/></> }; return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>; }

export function RotaractApp() {
  const [introVisible, setIntroVisible] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setIntroVisible(false), 1800); return () => window.clearTimeout(timer); }, []);
  const [section, setSection] = useState<RotaractSection>("inicio");
  const layoutRef = useRef<HTMLDivElement>(null);
  useEffect(() => { layoutRef.current?.scrollTo({ top: 0, behavior: "instant" }); }, [section]);
  useEffect(() => {
    const preventZoom = (event: Event) => {
      if (!window.matchMedia("(max-width: 700px)").matches) return;
      if (event.type.startsWith("gesture") || (event instanceof TouchEvent && event.touches.length > 1)) event.preventDefault();
    };
    const events = ["gesturestart", "gesturechange", "touchmove"];
    events.forEach((name) => document.addEventListener(name, preventZoom, { passive: false }));
    return () => events.forEach((name) => document.removeEventListener(name, preventZoom));
  }, []);
  useEffect(() => {
    const syncSection = () => {
      const requested = window.location.hash.slice(1);
      if (rotaractSections.some((item) => item.id === requested)) setSection(requested as RotaractSection);
      else setSection("inicio");
    };
    const timer = window.setTimeout(syncSection, 0);
    window.addEventListener("hashchange", syncSection);
    return () => { window.clearTimeout(timer); window.removeEventListener("hashchange", syncSection); };
  }, []);
  function selectSection(next: RotaractSection) {
    setSection(next);
    setProfileId(null);
    setEditUnlockOpen(false);
    setPassword("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const [data, setData] = useState<ClubData | null>(null);
  const [date, setDate] = useState(iso(saturday()));
  const [name, setName] = useState("");
  const [newApplicant, setNewApplicant] = useState(false);
  const [sortOrder, setSortOrder] = useState<"alphabetical" | "applicants" | "frequency-desc" | "frequency-asc">("alphabetical");
  const [shared, setShared] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [accessReady, setAccessReady] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const [editUnlockOpen, setEditUnlockOpen] = useState(false);
  useEffect(() => {
    if (!editUnlockOpen || unlocked) return;
    const dialog = document.querySelector<HTMLFormElement>(".rotaract-unlock-dialog");
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", trapFocus);
    return () => { document.removeEventListener("keydown", trapFocus); document.querySelector<HTMLButtonElement>(".rotaract-home-button")?.focus(); };
  }, [editUnlockOpen, unlocked]);
  const [cloudReady, setCloudReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "saving" | "saved" | "error">("connecting");
  const [dirty, setDirty] = useState(false);
  const [otherEditor, setOtherEditor] = useState(false);
  const [saveConflict, setSaveConflict] = useState(false);
  const [eventDraft, setEventDraft] = useState({ title: "", date: "", time: "", place: "", note: "" });
  const [calendarEditorOpen, setCalendarEditorOpen] = useState(false);
  const [monthCalendarOpen, setMonthCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => today().slice(0, 7));
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => today());
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [reasonEditorOpen, setReasonEditorOpen] = useState(false);
  const remoteStamp = useRef("");
  const accessPending = useRef(false);
  const dataRef = useRef<ClubData | null>(null);
  const savedDataRef = useRef<ClubData | null>(null);
  const minutesDrafts = useRef<MinutesDrafts>({});
  const editorId = useRef("");
  const dirtyRef = useRef(false);
  const dataLoaded = data !== null;

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { dirtyRef.current = dirty; }, [dirty]);
  useEffect(() => { const timer = window.setTimeout(() => { try { const stored = localStorage.getItem(STORAGE_KEY); minutesDrafts.current = JSON.parse(localStorage.getItem(MINUTES_DRAFTS_KEY) ?? "{}"); editorId.current = sessionStorage.getItem("tubio-rotaract-editor-id") ?? crypto.randomUUID(); sessionStorage.setItem("tubio-rotaract-editor-id", editorId.current); setData(mergeMinutes(stored ? normalizeData(JSON.parse(stored)) : initialData(), minutesDrafts.current)); } catch { setData(initialData()); } const until = Number(localStorage.getItem(ACCESS_UNTIL_KEY) ?? 0); setUnlocked(until > Date.now()); setAccessReady(true); }, 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

  async function tryAccess(code: string) {
    if (code.length !== 6 || accessPending.current) return;
    accessPending.current = true;
    try {
      const response = await fetch("/api/access-check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gate: "rotaract", code }) });
      if (!response.ok) throw new Error();
      const until = Date.now() + ACCESS_DURATION;
      localStorage.setItem(ACCESS_UNTIL_KEY, String(until));
      setUnlocked(true); setAccessError(false); setEditUnlockOpen(false); setPassword("");
    } catch { setAccessError(true); setPassword(""); }
    finally { accessPending.current = false; }
  }

  useEffect(() => {
    if (!dataLoaded) return;
    let active = true;
    async function readCloud() {
      try {
        const response = await fetch(SYNC_URL, { cache: "no-store" });
        if (!response.ok) throw new Error();
        const remote = await response.json() as { data: ClubData; updated_at: string } | null;
        if (!active || !remote) return;
        const normalizedRemote = mergeMinutes(normalizeData(remote.data), minutesDrafts.current);
        if (dirtyRef.current && remoteStamp.current && remote.updated_at !== remoteStamp.current) setSaveConflict(true);
        else if (!dirtyRef.current && remote.updated_at !== remoteStamp.current) { const remoteBase = normalizeData(remote.data); remoteStamp.current = remote.updated_at; savedDataRef.current = remoteBase; setData(normalizedRemote); setDirty(JSON.stringify(normalizedRemote) !== JSON.stringify(remoteBase)); setSaveConflict(false); }
        setCloudReady(true); setSyncStatus("saved");
      } catch { if (active) setSyncStatus("error"); }
    }
    void readCloud(); const timer = window.setInterval(() => void readCloud(), 4000);
    return () => { active = false; window.clearInterval(timer); };
  }, [dataLoaded]);

  useEffect(() => {
    if (!unlocked || !cloudReady || !editorId.current) return;
    let active = true;
    async function heartbeat() {
      try {
        const response = await fetch(SYNC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "claim", editorId: editorId.current }) });
        const presence = await response.json() as { editing_elsewhere?: boolean };
        if (active && response.ok) setOtherEditor(Boolean(presence.editing_elsewhere));
      } catch { /* El indicador de conexión ya comunica el problema. */ }
    }
    void heartbeat(); const timer = window.setInterval(() => void heartbeat(), 20000);
    return () => { active = false; window.clearInterval(timer); };
  }, [cloudReady, unlocked]);

  function mutateData(update: (current: ClubData) => ClubData) {
    if (!unlocked) return;
    const current = dataRef.current;
    if (!current) return;
    const next = update(current);
    dataRef.current = next;
    setData(next);
    setDirty(JSON.stringify(next) !== JSON.stringify(savedDataRef.current)); setSaveConflict(false);
  }

  async function saveChanges() {
    if (!unlocked || !data || !dirty || saveConflict) return;
    setSyncStatus("saving");
    try {
      const response = await fetch(SYNC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "save", data, baseUpdatedAt: remoteStamp.current, editorId: editorId.current }) });
      if (response.status === 409) { setSaveConflict(true); setSyncStatus("saved"); return; }
      if (!response.ok) throw new Error();
      const saved = await response.json() as { data?: ClubData; updated_at?: string };
      if (!saved.data || !saved.updated_at) throw new Error();
      remoteStamp.current = saved.updated_at;
      savedDataRef.current = normalizeData(saved.data);
      minutesDrafts.current = remainingMinutes(minutesDrafts.current, saved.data);
      localStorage.setItem(MINUTES_DRAFTS_KEY, JSON.stringify(minutesDrafts.current));
      setDirty(false); setSaveConflict(false); setSyncStatus("saved");
    } catch { setSyncStatus("error"); }
  }

  const meetings = useMemo(() => [...(data?.sessions ?? [])].sort((a, b) => a.date.localeCompare(b.date)), [data]);
  const meeting = data?.sessions.find((item) => item.date === date) ?? (data ? { date, held: true, marks: {} } : undefined);
  function attendanceFrequency(id: string) { return meetings.reduce((total, item) => total + (item.held && item.marks[id] === "present" ? 1 : 0), 0); }
  const members = (data?.members.filter((member) => member.joined <= date && (!member.retired || member.retired > date)) ?? []).sort((a, b) => {
    if (sortOrder === "applicants") return Number(Boolean(b.applicant)) - Number(Boolean(a.applicant)) || a.name.localeCompare(b.name, "es");
    if (sortOrder === "frequency-desc") return attendanceFrequency(b.id) - attendanceFrequency(a.id) || a.name.localeCompare(b.name, "es");
    if (sortOrder === "frequency-asc") return attendanceFrequency(a.id) - attendanceFrequency(b.id) || a.name.localeCompare(b.name, "es");
    return a.name.localeCompare(b.name, "es");
  });
  const upcoming = [...(data?.events ?? [])].filter((event) => event.date >= today()).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const monthDays = useMemo(() => {
    const [year, month] = calendarMonth.split("-").map(Number);
    const first = new Date(year, month - 1, 1, 12);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return iso(day);
    });
  }, [calendarMonth]);
  const monthLabel = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(new Date(`${calendarMonth}-01T12:00:00`));
  const selectedDayEvents = [...(data?.events ?? [])].filter((event) => event.date === selectedCalendarDate).sort((a, b) => a.time.localeCompare(b.time));
  function moveCalendarMonth(delta: number) { const [year, month] = calendarMonth.split("-").map(Number); const next = new Date(year, month - 1 + delta, 1, 12); const nextMonth = iso(next).slice(0, 7); setCalendarMonth(nextMonth); setSelectedCalendarDate(`${nextMonth}-01`); }
  function selectCalendarDay(day: string, outside: boolean) { setSelectedCalendarDate(day); if (outside) setCalendarMonth(day.slice(0, 7)); if (new Date(`${day}T12:00:00`).getDay() === 6) { setDate(day); } }
  async function leaveEditMode() { void fetch(SYNC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "release", editorId: editorId.current }) }).catch(() => undefined); localStorage.removeItem(ACCESS_UNTIL_KEY); setUnlocked(false); setOtherEditor(false); setEditUnlockOpen(false); setPassword(""); setAccessError(false); setCalendarEditorOpen(false); setEditingEventId(null); setEventDraft({ title: "", date: "", time: "", place: "", note: "" }); await fetch("/api/access-check?gate=rotaract", { method: "DELETE" }).catch(() => undefined); }
  function go(next: string) { setDate(next); }
  function editMeeting(patch: Partial<Meeting>) { if (!unlocked) return; mutateData((current) => ({ ...current, sessions: current.sessions.some((item) => item.date === date) ? current.sessions.map((item) => item.date === date ? { ...item, ...patch } : item) : [...current.sessions, { date, held: true, marks: {}, ...patch }] })); }
  function addMember(event: FormEvent) { event.preventDefault(); const clean = name.trim(); if (!unlocked || !clean) return; mutateData((current) => ({ ...current, members: [...current.members, { id: crypto.randomUUID(), name: clean, joined: date, applicant: newApplicant }] })); setName(""); setNewApplicant(false); }
  function setMark(id: string, mark: Mark) { if (!unlocked || !meeting?.held || date > today()) return; editMeeting({ marks: { ...meeting.marks, [id]: mark } }); }
  function absenceRun(id: string) { let count = 0; for (const item of meetings.filter((entry) => entry.date <= date && entry.held).reverse()) { const mark = item.marks[id]; if (mark === "absent") count += 1; else if (mark === "present") break; } return count; }
  function level(id: string) { return absenceRun(id) >= 3 ? "danger" : absenceRun(id) >= 2 ? "warning" : "active"; }
  function saveEvent(event: FormEvent) { event.preventDefault(); if (!unlocked || !eventDraft.title.trim() || !eventDraft.date) return; const clean = { ...eventDraft, title: eventDraft.title.trim() }; mutateData((current) => ({ ...current, events: editingEventId ? current.events.map((item) => item.id === editingEventId ? { ...item, ...clean } : item) : [...current.events, { id: crypto.randomUUID(), ...clean }] })); setEventDraft({ title: "", date: "", time: "", place: "", note: "" }); setEditingEventId(null); setCalendarEditorOpen(false); }
  function editEvent(event: ClubEvent) { if (!unlocked) return; setEventDraft({ title: event.title, date: event.date, time: event.time, place: event.place, note: event.note }); setEditingEventId(event.id); setCalendarEditorOpen(true); }
  function removeEvent(id: string) { if (!unlocked) return; mutateData((current) => ({ ...current, events: current.events.filter((event) => event.id !== id) })); }
  function proximityClass(eventDate: string) { const days = Math.ceil((new Date(`${eventDate}T12:00:00`).getTime() - new Date(`${today()}T12:00:00`).getTime()) / 86400000); return days <= 3 ? "event-imminent" : days <= 7 ? "event-soon" : days <= 21 ? "event-near" : "event-later"; }
  async function shareClub() { const payload = { title: "Rotaract Nuevo Medellín", text: "Consulta las próximas actividades, reuniones y asistencia de Rotaract Nuevo Medellín.", url: window.location.href }; try { if (navigator.share) await navigator.share(payload); else await navigator.clipboard.writeText(payload.url); setShared(true); window.setTimeout(() => setShared(false), 1800); } catch { /* El menú puede cerrarse sin compartir. */ } }
  function setApplicantProgress(id: string, field: "applicantMeetings" | "applicantWorks", index: number, checked: boolean) { if (!unlocked) return; mutateData((current) => ({ ...current, members: current.members.map((member) => { if (member.id !== id) return member; const values = [...(member[field] ?? [])]; values[index] = checked; return { ...member, [field]: values }; }) })); }
  const profile = data?.members.find((member) => member.id === profileId);
  const count = (mark: Mark) => members.filter((member) => (meeting?.marks[member.id] ?? "excused") === mark).length;

  if (!accessReady) return <main className="attendance-page rotaract-page"><RotaractSplash /></main>;
  if (!data || !meeting) return <main className="attendance-page rotaract-page"><RotaractSplash /></main>;

  return <main data-club="rotaract" className="attendance-page rotaract-page">
    {introVisible && <RotaractSplash />}
    <header className="attendance-topbar"><button type="button" className="attendance-logo rotaract-header-logo club-logo-refresh" onClick={() => window.location.reload()} aria-label="Actualizar Rotaract"><Image src="/images/clubs/rotaract-nuevo-medellin.png" alt="Rotaract Nuevo Medellín" width={182} height={63} priority/></button><div className="attendance-top-actions"><ClubAppControls club="rotaract" appName="Rotaract Nuevo Medellín" /><button className="share-attendance rotaract-share" type="button" onClick={() => void shareClub()} aria-label="Compartir Rotaract Nuevo Medellín"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg><span>{shared ? "¡Copiado!" : "Compartir"}</span></button><div className={`autosave rotaract-sync-dot ${syncStatus}`} role="status" aria-label={syncStatus === "connecting" ? "Conectando" : syncStatus === "saving" ? "Guardando" : syncStatus === "error" ? "Sin conexión" : "Conectado"} title={syncStatus === "connecting" ? "Conectando" : syncStatus === "saving" ? "Guardando" : syncStatus === "error" ? "Sin conexión" : "Conectado"}><span/></div></div></header>
    <RotaractNavigation section={section} onSelect={selectSection} unlocked={unlocked} onEdit={() => { if (unlocked) void leaveEditMode(); else { setPassword(""); setAccessError(false); setEditUnlockOpen(true); } }} />
    <div ref={layoutRef} className={`attendance-layout rotaract-section-layout ${section === "asistencias" ? "with-history" : ""}`} data-section={section}>
      {section === "asistencias" && <aside className="attendance-sidebar"><div className="sidebar-app-title"><span><Icon name="people"/></span><div><strong>Rotaract</strong><small>Nuevo Medellín</small></div></div><p className="sidebar-caption">Reuniones quincenales</p><div className="session-list">{[...meetings].filter((item) => item.date <= today() || !item.held || Object.keys(item.marks).length > 0).reverse().slice(0, 8).map((item) => <button className={item.date === date ? "active" : ""} key={item.date} onClick={() => go(item.date)}><span><Icon name="calendar"/></span><div><strong>{pretty(item.date, true)}</strong><small>{item.held ? "Reunión del club" : "No hubo reunión"}</small></div></button>)}</div></aside>}
      <section className="attendance-workspace" aria-label={rotaractSections.find((item) => item.id === section)?.label}>
        {unlocked && (dirty || otherEditor || saveConflict) && <div className={`rotaract-save-bar ${otherEditor || saveConflict ? "has-warning" : ""}`} role="status"><div>{saveConflict ? <><strong>Hay una versión más reciente</strong><small>Otro dispositivo guardó primero. Recarga antes de continuar.</small></> : otherEditor ? <><strong>Ya hay alguien editando</strong><small>Guarda para evitar sobreescribir información.</small></> : <><strong>Cambios sin guardar</strong><small>Guárdalos cuando termines.</small></>}</div>{dirty && <button type="button" disabled={syncStatus === "saving" || saveConflict} onClick={() => void saveChanges()}>{syncStatus === "saving" ? "Guardando…" : "Guardar"}</button>}</div>}
        <div className="attendance-heading"><div><h1>{section === "fechas" ? "Fechas del club" : section === "asistencias" ? "Reuniones" : section === "tesoreria" ? "Tesorería" : section === "varios" ? "Varios" : "Rotaract Nuevo Medellín"}</h1>{(section === "fechas" || section === "asistencias") && <span>{section === "fechas" ? "Calendario, actividades y próximas reuniones." : "Socios, aspirantes y asistencia por reunión."}</span>}</div>{unlocked && section === "asistencias" && <form className="add-person rotaract-add-person" onSubmit={addMember}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del socio o aspirante"/><label className={`applicant-add ${newApplicant ? "checked" : ""}`}><input type="checkbox" checked={newApplicant} onChange={(event) => setNewApplicant(event.target.checked)}/><span>✓</span> Aspirante</label><button><Icon name="plus"/> Agregar</button></form>}</div>

        {section === "fechas" && <section className={`rotaract-calendar ${unlocked && calendarEditorOpen ? "is-editing" : ""}`}>
          <div className="rotaract-section-title calendar-only-actions">
            <div className="calendar-title-actions">
              <button className="calendar-view-toggle" type="button" aria-expanded={monthCalendarOpen} onClick={() => setMonthCalendarOpen((current) => !current)}><Icon name="calendar"/>{monthCalendarOpen ? "Cerrar mes" : "Ver mes"}</button>
              <button className="calendar-lock-toggle calendar-add-event" type="button" disabled={!unlocked} aria-expanded={calendarEditorOpen} title={unlocked ? "Agregar una fecha" : "Mantén presionada la rueda de Inicio para editar"} onClick={() => { setCalendarEditorOpen(!calendarEditorOpen); setEditingEventId(null); setEventDraft({ title: "", date: selectedCalendarDate, time: "", place: "", note: "" }); }}><Icon name="plus"/>{calendarEditorOpen ? "Cerrar formulario" : "Agregar fecha"}</button>
            </div>
          </div>

          {monthCalendarOpen && <div className="club-month-calendar">
            <div className="month-calendar-toolbar"><button type="button" onClick={() => moveCalendarMonth(-1)} aria-label="Mes anterior"><Icon name="left"/></button><div><small>Calendario mensual.</small><strong>{monthLabel}</strong></div><button type="button" onClick={() => moveCalendarMonth(1)} aria-label="Mes siguiente"><Icon name="right"/></button></div>
            <div className="month-weekdays" aria-hidden="true">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="month-days">{monthDays.map((day) => { const dayEvents = data.events.filter((item) => item.date === day); const outside = day.slice(0, 7) !== calendarMonth; return <button type="button" key={day} className={`${outside ? "outside" : ""} ${day === today() ? "today" : ""} ${day === selectedCalendarDate ? "selected" : ""}`} onClick={() => selectCalendarDay(day, outside)}><time dateTime={day}>{Number(day.slice(-2))}</time><span className="month-event-titles">{dayEvents.slice(0, 2).map((item) => <i className={proximityClass(item.date)} key={item.id}>{item.time && <b>{item.time}</b>} {item.title}</i>)}</span>{dayEvents.length > 2 && <small>+{dayEvents.length - 2} más</small>}<span className="month-event-dots" aria-hidden="true">{dayEvents.slice(0, 3).map((item) => <i className={proximityClass(item.date)} key={item.id}/>)}</span></button>; })}</div>
            <div className="selected-day-agenda"><div><small>Fecha seleccionada</small><strong>{pretty(selectedCalendarDate)}</strong></div>{selectedDayEvents.length ? <div className="selected-day-events">{selectedDayEvents.map((event) => <article key={event.id}><span/><div><strong>{event.title}</strong><small>{[event.time, event.place].filter(Boolean).join(" · ") || "Detalles por confirmar"}</small>{event.note && <p>{event.note}</p>}</div>{unlocked && <button type="button" onClick={() => editEvent(event)} aria-label={`Editar ${event.title}`}><Icon name="edit"/></button>}</article>)}</div> : <p>No hay actividades programadas para este día.</p>}<button className="add-on-selected-day" type="button" disabled={!unlocked} title={unlocked ? "Agregar en esta fecha" : "Mantén presionada la rueda de Inicio para editar"} onClick={() => { setCalendarEditorOpen(true); setEditingEventId(null); setEventDraft({ title: "", date: selectedCalendarDate, time: "", place: "", note: "" }); }}><Icon name="plus"/> Agregar en esta fecha</button></div>
          </div>}

          <div className="rotaract-events rotaract-event-preview">{upcoming.slice(0, 3).map((event) => <article className={proximityClass(event.date)} key={event.id}><time dateTime={event.date}><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("es-CO", { month: "short" }).format(new Date(`${event.date}T12:00:00`))}</span></time><div><h3>{event.title}</h3><p>{[event.time, event.place].filter(Boolean).join(" · ") || "Detalles por confirmar"}</p>{event.note && <small>{event.note}</small>}</div>{unlocked && <div className="event-actions"><button onClick={() => editEvent(event)} aria-label={`Editar ${event.title}`}><Icon name="edit"/></button><button onClick={() => removeEvent(event.id)} aria-label={`Eliminar ${event.title}`}><Icon name="trash"/></button></div>}</article>)}{!upcoming.length && <div className="rotaract-empty-event">Aún no hay próximas fechas.</div>}</div>
          {unlocked && calendarEditorOpen && <form className="rotaract-event-form" onSubmit={saveEvent}><input value={eventDraft.title} onChange={(event) => setEventDraft({ ...eventDraft, title: event.target.value })} placeholder="Nombre del evento"/><input type="date" value={eventDraft.date} onChange={(event) => setEventDraft({ ...eventDraft, date: event.target.value })}/><input type="time" value={eventDraft.time} onChange={(event) => setEventDraft({ ...eventDraft, time: event.target.value })}/><input value={eventDraft.place} onChange={(event) => setEventDraft({ ...eventDraft, place: event.target.value })} placeholder="Lugar"/><input value={eventDraft.note} onChange={(event) => setEventDraft({ ...eventDraft, note: event.target.value })} placeholder="Nota breve"/><button><Icon name={editingEventId ? "calendar" : "plus"}/>{editingEventId ? "Guardar cambios" : "Agregar fecha"}</button>{editingEventId && <button className="cancel-event-edit" type="button" onClick={() => { setEditingEventId(null); setEventDraft({ title: "", date: "", time: "", place: "", note: "" }); }}>Cancelar</button>}</form>}
        </section>}

        {section === "asistencias" && <>
        <div className="session-card"><div className="session-date-control"><button onClick={() => go(shift(date, -7))} aria-label="Sábado anterior"><Icon name="left"/></button><div><span>Reunión del sábado</span><strong>{pretty(date)}</strong></div><button onClick={() => go(shift(date, 7))} aria-label="Sábado siguiente"><Icon name="right"/></button></div><div className="session-kind"><button disabled={!unlocked || date > today()} className={meeting.held ? "active" : ""} onClick={() => editMeeting({ held: true })}>Reunión normal</button><button disabled={!unlocked || date > today()} className={!meeting.held ? "active" : ""} onClick={() => editMeeting({ held: false })}>No hubo reunión</button></div></div>
        <div className="meeting-document-actions"><MeetingMinutes key={date} value={meeting.minutes} editable={unlocked && meeting.held} dirty={dirty} saving={syncStatus === "saving"} onSave={() => void saveChanges()} onRequestEdit={() => { setPassword(""); setAccessError(false); setEditUnlockOpen(true); }} onChange={(minutes) => { minutesDrafts.current = { ...minutesDrafts.current, [date]: minutes }; localStorage.setItem(MINUTES_DRAFTS_KEY, JSON.stringify(minutesDrafts.current)); editMeeting({ minutes }); }} /><AttendanceReportButton disabled={!meeting.held} report={{ minutes: meeting.minutes, club: "rotaract", title: "Rotaract Nuevo Medellín", date, held: meeting.held, meetingLabel: meeting.held ? "Reunión del club" : "No hubo reunión", syncPending: dirty, people: members.map((member) => ({ name: member.name, role: member.applicant ? "Aspirante" : "Socio", mark: meeting.marks[member.id] })) }} /></div>
        {date > today() && <div className="future-lock"><span className="future-lock-icon"><Icon name="lock"/></span><div><strong>Esta reunión está en el futuro</strong><p>Espera a que llegue. La asistencia se habilitará el sábado correspondiente.</p></div></div>}
        {!meeting.held ? <div className="no-session"><span>—</span><h2>No hubo reunión</h2><p>Esta fecha no contará como asistencia ni ausencia.</p>{meeting.reason && <p className="no-session-reason">Motivo: {meeting.reason}</p>}{unlocked && <><button type="button" className="add-reason" onClick={() => setReasonEditorOpen((open) => !open)}>{reasonEditorOpen ? "Cerrar motivo" : "Añadir motivo"}</button>{reasonEditorOpen && <textarea className="meeting-reason" value={meeting.reason ?? ""} placeholder="¿Por qué no hubo reunión?" onChange={(event) => editMeeting({ reason: event.target.value })}/>}</>}</div> : <><div className="attendance-summary"><div><strong>{members.length}</strong><span>Personas</span></div><div className="present"><i/><strong>{count("present")}</strong><span>Asistieron</span></div><div className="absent"><i/><strong>{count("absent")}</strong><span>No asistieron</span></div><div><strong>{count("excused")}</strong><span>No aplica</span></div></div><details className="people-card"><summary className="people-card-summary">Socios y aspirantes <span>+</span></summary><div className="people-card-content"><div className="people-card-title"><div><p>{unlocked ? "Toca el estado para actualizarlo y el nombre para consultar su historial." : "Consulta quién asistió en la fecha seleccionada y toca un nombre para ver su historial."}</p></div><div className="people-tools"><label>Ordenar por<select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}><option value="alphabetical">Orden alfabético</option><option value="applicants">Aspirantes primero</option><option value="frequency-desc">Mayor frecuencia</option><option value="frequency-asc">Menor frecuencia</option></select></label><span>{members.length} registrados</span></div></div><div className="people-list">{members.map((member) => { const selected = meeting.marks[member.id] ?? "excused"; const status = level(member.id); return <article className="person-row" key={member.id}><button className="person-identity" onClick={() => setProfileId(member.id)}><span className={`avatar ${status}`}>{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{member.name}</strong><div className="person-badges"><small className={status}>{status === "danger" ? "Necesita acompañamiento" : status === "warning" ? "Atención" : "Activo"}</small>{member.applicant && <em className="applicant-badge">Aspirante</em>}</div></div></button><div className="attendance-options rotaract-options">{([ ["present", "Asistió"], ["absent", "No asistió"], ["excused", "No aplica"] ] as [Mark, string][]).map(([value, label]) => <button disabled={!unlocked || date > today()} key={value} className={`${value} ${selected === value ? "selected" : ""}`} onClick={() => setMark(member.id, value)}><i>{selected === value ? "✓" : ""}</i><span>{label}</span></button>)}</div></article>; })}{!members.length && <div className="empty-people">Todavía no hay personas registradas para esta fecha.</div>}</div></div></details></>}
        </>}
        {section === "inicio" && <div className="rotaract-home"><InteractiveRotaryWheel /><section className="home-upcoming"><div><strong>Próximas fechas</strong><small>{upcoming.length ? `${upcoming.length} en agenda` : "Sin fechas programadas"}</small></div>{upcoming.slice(0, 2).map((event) => <article key={event.id}><time dateTime={event.date}>{pretty(event.date, true)}</time><span>{event.title}</span></article>)}{upcoming.length > 0 && <button type="button" onClick={() => selectSection("fechas")}>Ver todas</button>}</section></div>}
        {section === "varios" && <div className="rotaract-misc"><details><summary>Invocación de Rotaract <span>+</span></summary><p>Que en esta reunión se afiance la amistad y el compañerismo, quede impresa la huella del servicio en pro de la comunidad y se fortalezca la compresión entre nosotros para poder llevarla a todas las personas del mundo. Que contribuyamos a dignificar nuestro país, cultivando una personalidad ética y moralmente intachable, y ratifiquemos que nuestra juventud es símbolo de renovación dispuesta a aportar todo de sí en favor del progreso y el futuro de la patria, para que se cumplan nuestros anhelos de paz, justicia, solidaridad y respeto por los derechos humanos. Que así sea.</p></details><details><summary>Diapos de bienvenida <span>+</span></summary><div className="rotaract-slides"><p>Presentación de bienvenida del club.</p><a href="https://canva.link/cht51ie2z8dqz2w" target="_blank" rel="noreferrer">Abrir presentación en Canva</a></div></details><details><summary>Ver redes del club <span>+</span></summary><div className="rotaract-slides"><a href="https://www.instagram.com/rtc.nuevomedellin/" target="_blank" rel="noreferrer">Abrir Instagram</a></div></details></div>}
        {section === "tesoreria" && <RotaractTreasury members={data.members} unlocked={unlocked} value={data.treasury} onChange={(treasury) => mutateData((current) => ({ ...current, treasury }))} onRequestEdit={() => { setPassword(""); setAccessError(false); setEditUnlockOpen(true); }}/>}
      </section>
    </div>
    {editUnlockOpen && !unlocked && <div className="rotaract-unlock-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setEditUnlockOpen(false); }}><form className="rotaract-unlock-dialog" role="dialog" aria-modal="true" aria-labelledby="unlock-title" onKeyDown={(event) => { if (event.key === "Escape") setEditUnlockOpen(false); }} onSubmit={(event) => { event.preventDefault(); void tryAccess(password); }}><button className="unlock-close" type="button" aria-label="Cerrar" onClick={() => setEditUnlockOpen(false)}><Icon name="close"/></button><div className="unlock-wheel"><RotaryWheel decorative /></div><h2 id="unlock-title">Desbloquear edición</h2><label>Código<input autoFocus autoComplete="off" type="password" inputMode="numeric" maxLength={6} value={password} onChange={(event) => { const next = event.target.value.replace(/\D/g, ""); setPassword(next); setAccessError(false); if (next.length === 6) void tryAccess(next); }} placeholder="••••••" aria-invalid={accessError}/></label>{accessError && <p role="alert">Código incorrecto o acceso bloqueado temporalmente.</p>}<button type="submit" disabled={password.length !== 6}>Desbloquear</button></form></div>}
    {profile && <div className="profile-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setProfileId(null)}><aside className="profile-panel"><button className="profile-close" onClick={() => setProfileId(null)}><Icon name="close"/></button><div className="profile-header"><span className={`avatar large ${level(profile.id)}`}>{profile.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><p>{profile.applicant ? "Historial del aspirante" : "Historial del socio"}</p><input className="profile-name-input" disabled={!unlocked} value={profile.name} onChange={(event) => mutateData((current) => ({ ...current, members: current.members.map((member) => member.id === profile.id ? { ...member, name: event.target.value } : member) }))}/><small>Desde {pretty(profile.joined, true)}</small><label className={`profile-applicant ${profile.applicant ? "checked" : ""}`}><input type="checkbox" disabled={!unlocked} checked={Boolean(profile.applicant)} onChange={(event) => mutateData((current) => ({ ...current, members: current.members.map((member) => member.id === profile.id ? { ...member, applicant: event.target.checked } : member) }))}/><span>✓</span> Es aspirante</label></div><div className="history-list">{[...meetings].reverse().filter((item) => item.date >= profile.joined).map((item) => { const mark = item.held ? (item.marks[profile.id] ?? "excused") : null; return <div key={item.date}><span className={mark ?? "skipped"}>{mark ? "✓" : "—"}</span><div><strong>{pretty(item.date, true)}</strong><small>{item.held ? mark === "present" ? "Asistió" : mark === "absent" ? "No asistió" : "No aplica" : "No hubo reunión"}</small></div></div>; })}</div>{unlocked && <button className="retire-person" onClick={() => { mutateData((current) => ({ ...current, members: current.members.map((member) => member.id === profile.id ? { ...member, retired: date } : member) })); setProfileId(null); }}><Icon name="trash"/> Retirar desde esta reunión</button>}</aside></div>}
    {profile?.applicant && <section className="applicant-progress applicant-progress-floating"><div><strong>Ruta del aspirante</strong><small>Seguimiento dentro de su perfil</small></div>{([ ["Reuniones", "applicantMeetings", 5], ["Obras", "applicantWorks", 3] ] as const).map(([label, field, total]) => <fieldset key={field}><legend>{label}</legend><div>{Array.from({ length: total }, (_, index) => <label className={profile[field]?.[index] ? "checked" : ""} key={index}><input type="checkbox" disabled={!unlocked} checked={Boolean(profile[field]?.[index])} onChange={(event) => setApplicantProgress(profile.id, field, index, event.target.checked)}/><span>✓</span><small>{index + 1}</small></label>)}</div></fieldset>)}</section>}
  </main>;
}
