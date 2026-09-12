import Link from "next/link";
import { site } from "@/content/site";
import "./deluxe.css";

export const metadata = { title: "Template 3 · Maison", description: "Una experiencia editorial con carácter. Diseño, intención y una presencia que permanece." };
const details = [
  ["01", "Una mirada propia.", "Tu esencia, llevada al detalle. Una identidad que se reconoce incluso antes de leer tu nombre.", "Identidad"],
  ["02", "El arte de lo esencial.", "Cada palabra, cada espacio, cada gesto tiene una intención. Lo que importa encuentra su lugar.", "Experiencia"],
  ["03", "Hecha para quedarse.", "Una primera impresión que abre la conversación. Y una experiencia que invita a volver.", "Conexión"],
];
function Sculpture() {
  return <div className="maison-sculpture" aria-hidden="true"><div className="maison-halo" /><div className="maison-loop maison-loop-one" /><div className="maison-loop maison-loop-two" /><div className="maison-plinth" /></div>;
}
export default function TemplateThreePage() {
  return (
    <main className="maison">
      <a className="maison-skip" href="#historia">Ir al contenido</a>
      <div className="maison-preview"><Link href="/">← TuBio / colección de templates</Link><span>03 — EDICIÓN DELUXE</span></div>
      <header className="maison-header"><a href="#inicio" className="maison-wordmark" aria-label="Maison, inicio">maison<span>®</span></a><nav aria-label="Navegación principal"><a href="#historia">La esencia</a><a href="#detalles">Los detalles</a></nav><a className="maison-header-cta" href="#contacto">Creemos algo único <span aria-hidden="true">↗</span></a></header>
      <section id="inicio" className="maison-hero" aria-labelledby="maison-title">
        <div className="maison-hero-copy"><p className="maison-kicker">● &nbsp; DISEÑADO PARA SENTIRSE</p><h1 id="maison-title">Lo extraordinario<br />está en <em>la esencia.</em></h1><p className="maison-intro">Una presencia que habla por ti.<br />Con intención, con carácter, con una belleza que no necesita explicación.</p><a href="#historia" className="maison-link">Explora nuestra esencia <span aria-hidden="true">↗</span></a><div className="maison-hero-footnote"><span>EST. 2026</span><span>Una mirada distinta.<br />Una impresión duradera.</span></div></div>
        <div className="maison-art"><div className="maison-art-top"><span>OBJETO DE ESTUDIO</span><span>N.º 003</span></div><Sculpture /><span className="maison-art-side">FORMA · EQUILIBRIO · INTENCIÓN</span><div className="maison-art-bottom"><span>La belleza de lo esencial</span><span>FIG. 01 — MAISON</span></div></div>
      </section>
      <div className="maison-values"><span>Menos ruido. Más esencia.</span><i aria-hidden="true">✳</i><span>El detalle hace la diferencia.</span><i aria-hidden="true">✳</i><span>Lo auténtico permanece.</span></div>
      <section id="historia" className="maison-story"><p className="maison-kicker">01 / NUESTRA FILOSOFÍA</p><div><h2>Hay cosas que se ven.<br />Otras, <em>se sienten.</em></h2><div className="maison-story-body"><span className="maison-star" aria-hidden="true">✳</span><div><p>Creemos en las marcas que tienen algo propio. En los detalles que descubres al mirar de cerca. En hacer menos, pero hacerlo extraordinariamente bien.</p><p>Por eso creamos espacios donde tu historia respira y tu esencia se convierte en una experiencia.</p></div></div></div></section>
      <section id="detalles" className="maison-details" aria-labelledby="details-title"><div className="maison-section-heading"><p className="maison-kicker">02 / LO QUE NOS DEFINE</p><h2 id="details-title">Nada está aquí <em>por casualidad.</em></h2></div><div className="maison-cards">{details.map(([number, title, body, label]) => <article key={number}><div className="maison-card-top"><span>{number}</span><span aria-hidden="true">↗</span></div><h3>{title}</h3><p>{body}</p><span className="maison-card-label">{label}</span></article>)}</div></section>
      <section className="maison-manifesto"><div className="maison-manifesto-art"><Sculpture /></div><div className="maison-manifesto-copy"><p className="maison-kicker">EL LUJO DE SER TÚ</p><h2>Una firma.<br />No una <em>fórmula.</em></h2><p>Lo que te hace diferente merece una forma de mostrarse igual de especial.</p><span className="maison-signature">Con intención, siempre.</span></div></section>
      <section id="contacto" className="maison-contact"><p className="maison-kicker">03 / EL SIGUIENTE CAPÍTULO</p><h2>Hagamos algo<br /><em>que permanezca.</em></h2><a href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent("Hola, me interesa la template 3 Maison para mi marca.")}`} className="maison-contact-link" target="_blank" rel="noreferrer">Hablemos de tu marca <span aria-hidden="true">↗</span></a><p>Tu esencia. Nuestra atención a cada detalle.</p></section>
      <footer className="maison-footer"><a href="#inicio" className="maison-wordmark">maison<span>®</span></a><span>Una experiencia por TuBio · 2026</span><Link href="/">Explorar las templates ↗</Link></footer>
    </main>
  );
}
