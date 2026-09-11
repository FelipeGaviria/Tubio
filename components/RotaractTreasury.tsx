"use client";

import { useMemo, useState } from "react";

type TreasuryMember = { id: string; name: string; applicant?: boolean; retired?: string };
export type TreasuryPlan = "monthly" | "semester" | "annual";
export type TreasuryPayment = { id: string; memberId: string; plan: TreasuryPlan; period: string; amount: number; paidAt: string };
export type TreasuryData = { plans: Record<string, TreasuryPlan>; payments: TreasuryPayment[] };

export const emptyTreasury = (): TreasuryData => ({ plans: {}, payments: [] });
export function normalizeTreasury(value?: Partial<TreasuryData>): TreasuryData {
  return { plans: value?.plans && typeof value.plans === "object" ? value.plans : {}, payments: Array.isArray(value?.payments) ? value.payments : [] };
}

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const currentMonth = () => new Date().toISOString().slice(0, 7);
const periodFor = (plan: TreasuryPlan, month: string) => plan === "monthly" ? month : plan === "annual" ? month.slice(0, 4) : `${month.slice(0, 4)}-S${Number(month.slice(5, 7)) <= 6 ? 1 : 2}`;
const covers = (payment: TreasuryPayment, month: string) => payment.period === periodFor(payment.plan, month);
const planPrice = (plan: TreasuryPlan, month: string) => plan === "annual" ? 276000 : plan === "semester" ? 138000 : month === currentMonth() && new Date().getDate() > 15 ? 27000 : 25000;

export function RotaractTreasury({ members, unlocked, value, onChange, onRequestEdit }: { members: TreasuryMember[]; unlocked: boolean; value: TreasuryData; onChange: (value: TreasuryData) => void; onRequestEdit: () => void }) {
  const [month, setMonth] = useState(currentMonth);
  const socios = useMemo(() => members.filter((member) => !member.applicant && !member.retired).sort((a, b) => a.name.localeCompare(b.name, "es")), [members]);
  const monthLabel = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" }).format(new Date(`${month}-01T12:00:00`));
  const paid = socios.filter((member) => value.payments.some((payment) => payment.memberId === member.id && covers(payment, month)));
  function moveMonth(delta: number) { const date = new Date(`${month}-01T12:00:00`); date.setMonth(date.getMonth() + delta); setMonth(date.toISOString().slice(0, 7)); }
  function togglePayment(member: TreasuryMember) {
    if (!unlocked) { onRequestEdit(); return; }
    const existing = value.payments.find((payment) => payment.memberId === member.id && covers(payment, month));
    if (existing) { onChange({ ...value, payments: value.payments.filter((payment) => payment.id !== existing.id) }); return; }
    const plan = value.plans[member.id] ?? "monthly";
    onChange({ ...value, payments: [...value.payments, { id: crypto.randomUUID(), memberId: member.id, plan, period: periodFor(plan, month), amount: planPrice(plan, month), paidAt: new Date().toISOString().slice(0, 10) }] });
  }
  return <section className="rotaract-treasury">
    <div className="treasury-rates">
      <article><span>Pronto pago</span><strong>{money.format(25000)}</strong><small>Antes del 16 de cada mes</small></article>
      <article><span>Después del 16</span><strong>{money.format(27000)}</strong><small>Cuota mensual</small></article>
      <article><span>Semestral</span><strong>{money.format(138000)}</strong><small>Pago anticipado</small></article>
      <article><span>Anual</span><strong>{money.format(276000)}</strong><small>Pago anticipado</small></article>
    </div>
    <div className="treasury-period"><button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior">‹</button><div><small>Estado de pagos</small><strong>{monthLabel}</strong></div><button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente">›</button></div>
    <div className="treasury-overview"><div><span>Al día</span><strong>{paid.length}</strong></div><div><span>Pendientes</span><strong>{socios.length - paid.length}</strong></div></div>
    <p className="treasury-note">Los aspirantes no pagan cuota. Los pagos semestrales y anuales solo se registran de forma anticipada. Plazo máximo: primer semestre, 30 de septiembre; segundo semestre, 28 de febrero.</p>
    <div className="treasury-members"><h2>Socios del club</h2>{socios.map((member) => { const payment = value.payments.find((item) => item.memberId === member.id && covers(item, month)); const plan = value.plans[member.id] ?? "monthly"; return <article key={member.id} className={payment ? "is-paid" : "is-pending"}><span className="treasury-avatar">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div className="treasury-person"><strong>{member.name}</strong><small>{payment ? `Pagó ${money.format(payment.amount)} · ${payment.paidAt}` : "Pago pendiente"}</small></div>{unlocked && <select aria-label={`Plan de ${member.name}`} value={plan} onChange={(event) => onChange({ ...value, plans: { ...value.plans, [member.id]: event.target.value as TreasuryPlan } })}><option value="monthly">Mensual</option><option value="semester">Semestral</option><option value="annual">Anual</option></select>}<button type="button" className={payment ? "treasury-unpay" : "treasury-pay"} onClick={() => togglePayment(member)}>{payment ? "Desmarcar" : "Marcar pago"}</button></article>; })}{!socios.length && <p>Aún no hay socios activos. Puedes agregarlos desde Reuniones.</p>}</div>
  </section>;
}
