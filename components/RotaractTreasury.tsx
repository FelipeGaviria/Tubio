type TreasuryMember = { id: string; name: string; applicant?: boolean; retired?: string };

export function RotaractTreasury({ members, unlocked, onUnlock }: { members: TreasuryMember[]; unlocked: boolean; onUnlock: () => void }) {
  const socios = members.filter((member) => !member.applicant && !member.retired).sort((a, b) => a.name.localeCompare(b.name, "es"));
  return <section className="rotaract-treasury">
    <div className="treasury-overview"><div><span>Cuota mensual</span><strong>$25.000 <small>COP</small></strong></div><div><span>Socios</span><strong>{socios.length}</strong></div></div>
    <p className="treasury-note">Los aspirantes no pagan cuota. Aquí organizaremos los pagos por mes y los adelantos.</p>
    {!unlocked ? <button type="button" className="treasury-open" onClick={onUnlock}>Abrir con el candado</button> : <div className="treasury-members"><h2>Socios del club</h2><p>El registro de pagos y el cálculo de deudas se configurarán después.</p>{socios.map((member) => <article key={member.id}><span className="treasury-avatar">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><strong>{member.name}</strong><small>Sin configurar</small></article>)}{!socios.length && <p>Aún no hay socios activos. Puedes agregarlos desde Asistencias.</p>}</div>}
  </section>;
}
