"use client";

import { useMemo, useState } from "react";

type TreasuryMember = { id: string; name: string; joined?: string; applicant?: boolean; retired?: string };
export type TreasuryPlan = "monthly" | "semester" | "annual";
export type TreasuryPayment = { id: string; memberId: string; plan: TreasuryPlan; period: string; amount: number; paidAt: string };
export type TreasuryData = { plans: Record<string, TreasuryPlan>; payments: TreasuryPayment[] };

export const emptyTreasury = (): TreasuryData => ({ plans: {}, payments: [] });
export function normalizeTreasury(value?: Partial<TreasuryData>): TreasuryData {
  return { plans: value?.plans && typeof value.plans === "object" ? value.plans : {}, payments: Array.isArray(value?.payments) ? value.payments : [] };
}

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const currentMonth = () => new Date().toISOString().slice(0, 7);
const rotaryStartYear = (month: string) => Number(month.slice(5, 7)) >= 8 ? Number(month.slice(0, 4)) : Number(month.slice(0, 4)) - 1;
const rotaryYear = (month: string) => { const start = rotaryStartYear(month); return `${start}–${start + 1}`; };
const semester = (month: string) => { const value = Number(month.slice(5, 7)); return value >= 8 || value === 1 ? 1 : 2; };
const periodFor = (plan: TreasuryPlan, month: string) => plan === "monthly" ? month : plan === "annual" ? `${rotaryStartYear(month)}-${rotaryStartYear(month) + 1}` : `${rotaryStartYear(month)}-S${semester(month)}`;
const covers = (payment: TreasuryPayment, month: string) => payment.period === periodFor(payment.plan, month) || (payment.plan === "annual" && payment.period === month.slice(0, 4));
const planPrice = (plan: TreasuryPlan, month: string) => plan === "annual" ? 276000 : plan === "semester" ? 138000 : month === currentMonth() && new Date().getDate() > 15 ? 27000 : 25000;
const cycleMonths = (month: string) => {
  const start = rotaryStartYear(month);
  return Array.from({ length: 12 }, (_, index) => {
    const value = new Date(start, 7 + index, 1, 12);
    return value.toISOString().slice(0, 7);
  });
};

export function RotaractTreasury({ members, unlocked, value, onChange, onRequestEdit }: { members: TreasuryMember[]; unlocked: boolean; value: TreasuryData; onChange: (value: TreasuryData) => void; onRequestEdit: () => void }) {
  const [month, setMonth] = useState(currentMonth);
  const [visibleDebts, setVisibleDebts] = useState<Record<string, boolean>>({});
  const [paymentInfoOpen, setPaymentInfoOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const socios = useMemo(() => members.filter((member) => !member.applicant && !member.retired).sort((a, b) => a.name.localeCompare(b.name, "es")), [members]);
  const monthLabel = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(new Date(`${month}-01T12:00:00`));
  const paid = socios.filter((member) => value.payments.some((payment) => payment.memberId === member.id && covers(payment, month)));
  function moveMonth(delta: number) { const date = new Date(`${month}-01T12:00:00`); date.setMonth(date.getMonth() + delta); setMonth(date.toISOString().slice(0, 7)); }
  function debtFor(member: TreasuryMember) {
    const latest = month < currentMonth() ? month : currentMonth();
    return cycleMonths(month).filter((item) => item <= latest && item >= (member.joined?.slice(0, 7) ?? item) && !value.payments.some((payment) => payment.memberId === member.id && covers(payment, item))).reduce((total, item) => total + (item < currentMonth() || (item === currentMonth() && new Date().getDate() > 15) ? 27000 : 25000), 0);
  }
  function togglePayment(member: TreasuryMember) {
    if (!unlocked) { onRequestEdit(); return; }
    const existing = value.payments.find((payment) => payment.memberId === member.id && covers(payment, month));
    if (existing) { onChange({ ...value, payments: value.payments.filter((payment) => payment.id !== existing.id) }); return; }
    const plan = value.plans[member.id] ?? "monthly";
    onChange({ ...value, payments: [...value.payments, { id: crypto.randomUUID(), memberId: member.id, plan, period: periodFor(plan, month), amount: planPrice(plan, month), paidAt: new Date().toISOString().slice(0, 10) }] });
  }
  async function copy(value: string) { try { await navigator.clipboard.writeText(value); setCopied("Copiado"); window.setTimeout(() => setCopied(""), 1400); } catch { setCopied("No se pudo copiar"); window.setTimeout(() => setCopied(""), 1800); } }
  return <section className="rotaract-treasury">
    <div className="treasury-rates">
      <article><span>Pronto pago</span><strong>{money.format(25000)}</strong><small>Antes del 16 de cada mes</small></article>
      <article><span>Después del 16</span><strong>{money.format(27000)}</strong><small>Cuota mensual</small></article>
      <article><span>Semestral</span><strong>{money.format(138000)}</strong><small>Pago anticipado</small></article>
      <article><span>Anual</span><strong>{money.format(276000)}</strong><small>Pago anticipado</small></article>
    </div>
    <div className="treasury-period"><button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior">‹</button><div><small>{rotaryYear(month)}</small><strong>{monthLabel}</strong></div><button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente">›</button></div>
    <div className="treasury-overview"><div><span>Al día</span><strong>{paid.length}</strong></div><div><span>Pendientes</span><strong>{socios.length - paid.length}</strong></div><button type="button" className="treasury-payment-info" onClick={() => setPaymentInfoOpen(true)} aria-label="Ver datos para pagar"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M16.3 7.1c-.7-.7-2.1-1.2-4.1-1.2-2.6 0-4.2 1.2-4.2 3s1.6 2.7 4.2 3.1c2.6.4 4.2 1.3 4.2 3.1s-1.7 3-4.4 3c-2 0-3.5-.6-4.4-1.5"/></svg></span><small>Pagar</small></button></div>
    <p className="treasury-note">Los aspirantes no pagan cuota. Pago anticipado: primer semestre hasta el 30 de septiembre; segundo semestre hasta el 28 de febrero.</p>
    <details className="treasury-payments"><summary>Ver pagos <span>+</span></summary><div className="treasury-members"><h2>Socios del club</h2>{socios.map((member) => { const payment = value.payments.find((item) => item.memberId === member.id && covers(item, month)); const plan = value.plans[member.id] ?? "monthly"; const debt = debtFor(member); return <article key={member.id}><span className="treasury-avatar">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="treasury-person"><strong>{member.name}</strong><small>{payment ? `Pagó ${money.format(payment.amount)} · ${payment.paidAt}` : "Pago pendiente"}</small>{unlocked && <span className="treasury-debt"><button type="button" onClick={() => setVisibleDebts((current) => ({ ...current, [member.id]: !current[member.id] }))} aria-label={visibleDebts[member.id] ? `Ocultar deuda de ${member.name}` : `Ver deuda de ${member.name}`}>{visibleDebts[member.id] ? "◉" : "◎"}</button><small>Deuda acumulada: {visibleDebts[member.id] ? money.format(debt) : "••••••"}</small></span>}</div><div className="treasury-actions">{unlocked && <select aria-label={`Plan de ${member.name}`} value={plan} onChange={(event) => onChange({ ...value, plans: { ...value.plans, [member.id]: event.target.value as TreasuryPlan } })}><option value="monthly">Mensual</option><option value="semester">Semestral</option><option value="annual">Anual</option></select>}<button type="button" className={payment ? "treasury-unpay" : "treasury-pay"} onClick={() => togglePayment(member)}>{payment ? "Desmarcar" : "Marcar pago"}</button></div></article>; })}{!socios.length && <p>Aún no hay socios activos. Puedes agregarlos desde Reuniones.</p>}</div></details>
    {paymentInfoOpen && <div className="payment-info-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPaymentInfoOpen(false)}><section className="payment-info-modal" role="dialog" aria-modal="true" aria-label="Datos para pagar"><button type="button" className="payment-close" onClick={() => setPaymentInfoOpen(false)} aria-label="Cerrar">×</button><h2>Datos para pagar</h2>{([ ["BANCOLOMBIA", "23013750785"], ["Nequi", "3046518891"], ["NU · Cuenta de ahorros", "21329881"], ["Nu Placa", "COR223"] ] as const).map(([label, number]) => <div className="payment-line" key={label}><span><strong>{label}</strong><small>{number}</small></span><button type="button" onClick={() => void copy(number)}>Copiar</button></div>)}</section></div>}
    {copied && <div className="copy-toast" role="status">{copied}</div>}
  </section>;
}
