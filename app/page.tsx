import { Header } from "@/components/Header";
import { HeroPreview } from "@/components/HeroPreview";
import { Section } from "@/components/Section";
import { site, whatsappUrl } from "@/content/site";

export default function HomePage() {
  return (
    <main id="inicio">
      <Header />

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1>{site.hero.title}</h1>
            <p className="hero-body">{site.hero.body}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {site.hero.primaryAction}
              </a>
              <a className="button button-secondary" href="#servicios">
                {site.hero.secondaryAction}
              </a>
            </div>
            <div className="metrics" aria-label="Ventajas principales">
              {site.metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <Section id="servicios" eyebrow="Servicios" title="Una base para vender landings sin empezar de cero.">
        <div className="card-grid three-columns">
          {site.services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="proceso" eyebrow="Proceso" title="Orden simple para trabajar con cada cliente." tone="white">
        <ol className="process-list">
          {site.process.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </Section>



      <section id="contacto" className="cta-section">
        <div className="container cta-panel">
          <div>
            <p className="eyebrow">Siguiente paso</p>
            <h2>Ahora esta base puede convertirse en la primera landing de un cliente real.</h2>
            <p>
              Cambiamos el contenido, definimos estilo visual, agregamos imagenes y luego conectamos GitHub con Vercel.
            </p>
          </div>
          <a className="button button-light" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            Hablar por WhatsApp
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <p>{site.name}</p>
          <p>{site.contact.city}</p>
          <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
        </div>
      </footer>
    </main>
  );
}