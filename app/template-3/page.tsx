import Link from "next/link";

export const metadata = { title: "Template 3", description: "Landing editorial de producto con narrativa visual y llamada a la accion." };

const benefits = [
  ["01", "Una historia clara", "Presenta el valor de tu marca con ritmo, contexto y personalidad."],
  ["02", "Una experiencia propia", "Combina imagen, detalle y accion en una landing que se siente tuya."],
  ["03", "Un siguiente paso", "Lleva a tus visitantes de la inspiracion a la conversacion."],
];

export default function TemplateThreePage() {
  return (
    <main className="template-three-shell">
      <header className="template-three-header"><Link href="/landings">TuBio / Template 3</Link><span>Editorial landing / 2026</span></header>
      <section className="template-three-hero">
        <div className="template-three-hero-copy"><p className="template-three-eyebrow">Una marca con algo que decir</p><h1>Haz que tu historia <em>se sienta.</em></h1><p>Una estructura calida y narrativa para marcas de moda, belleza, gastronomia, experiencias y servicios con una mirada propia.</p><a className="template-three-button" href="#historia">Descubrir la propuesta <span>→</span></a></div>
        <div className="template-three-visual" aria-label="Composicion visual abstracta"><div className="template-three-orb" /><div className="template-three-ribbon">made with intention</div><strong>03</strong><small>TuBio studio</small></div>
      </section>
      <section id="historia" className="template-three-story"><p className="template-three-eyebrow">El orden de una buena experiencia</p><h2>Primero conectas.<br /><em>Luego conviertes.</em></h2><p className="template-three-story-lead">Esta template pone la identidad primero: una entrada visual, una idea central, beneficios memorables y un cierre que invita a dar el siguiente paso.</p><div className="template-three-benefits">{benefits.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
      <section className="template-three-quote"><p>"Tu marca no necesita gritar para quedarse en la memoria."</p><a className="template-three-button template-three-button-dark" href="#contacto">Quiero construir la mia <span>→</span></a></section>
      <footer id="contacto" className="template-three-footer"><span>Template 3 / narrativa editorial</span><Link href="/landings">Ver todas las landings</Link></footer>
    </main>
  );
}