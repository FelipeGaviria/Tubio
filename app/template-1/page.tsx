import Link from "next/link";

const templateBrand = {
  name: "Template 1",
  eyebrow: "Visual base / dark glass",
  subtitle:
    "Una landing tipo bio comercial para marcas tecnicas, servicios premium o productos con energia futurista.",
  actions: [
    { label: "WhatsApp", href: "#contacto" },
    { label: "Portafolio", href: "#casos" },
  ],
  socials: ["IG", "WA", "EM"],
  details: [
    {
      title: "Que muestra",
      body: "Oferta central, contacto rapido, diferenciales y casos visuales en una sola experiencia compacta.",
    },
    {
      title: "Como se adapta",
      body: "Se cambian logo, paleta, textos, enlaces, imagenes y tono para crear una landing con identidad propia.",
    },
  ],
  cases: ["Proyecto alpha", "Sistema premium", "Caso destacado"],
};

export default function TemplateOnePage() {
  return (
    <main className="template-one-shell">
      <div className="template-one-bg" aria-hidden="true" />

      <section className="template-one-stage">
        <Link className="template-back-link" href="/portafolio">
          Volver al portafolio
        </Link>

        <article className="template-one-card">
          <div className="template-logo-wrap">
            <div className="template-logo-mark">T1</div>
          </div>

          <p className="template-eyebrow">{templateBrand.eyebrow}</p>
          <h1>{templateBrand.name}</h1>
          <p className="template-subtitle">{templateBrand.subtitle}</p>

          <div className="template-socials" aria-label="Enlaces sociales de muestra">
            {templateBrand.socials.map((item) => (
              <a href="#contacto" key={item} aria-label={item}>
                {item}
              </a>
            ))}
          </div>

          <div className="template-actions">
            {templateBrand.actions.map((action, index) => (
              <a className={index === 0 ? "template-action-primary" : "template-action-secondary"} href={action.href} key={action.label}>
                {action.label}
              </a>
            ))}
          </div>

          <div className="template-detail-grid">
            {templateBrand.details.map((detail) => (
              <section className="template-detail" key={detail.title}>
                <h2>{detail.title}</h2>
                <p>{detail.body}</p>
              </section>
            ))}
          </div>

          <section id="casos" className="template-cases" aria-label="Casos de muestra">
            {templateBrand.cases.map((item) => (
              <article key={item}>
                <div className="template-case-visual" />
                <h2>{item}</h2>
                <p>Espacio reservado para imagen, resultado o descripcion breve del proyecto.</p>
              </article>
            ))}
          </section>

          <footer id="contacto" className="template-footer">
            <span>Landing raw editable</span>
            <Link href="/portafolio">Duplicar idea</Link>
          </footer>
        </article>
      </section>
    </main>
  );
}