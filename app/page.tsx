import Link from "next/link";
import Image from "next/image";

import { Header } from "@/components/Header";
import { FooterShareButton } from "@/components/FooterShareButton";
import { HeroPreview } from "@/components/HeroPreview";
import { LandingWheel } from "@/components/LandingWheel";
import { Section } from "@/components/Section";
import { ThemeToggle } from "@/components/ThemeToggle";
import { landingTemplates, site, whatsappUrl } from "@/content/site";

export default function HomePage() {
  return (
    <main id="inicio" className="home-art">
      <Header />

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-meta">
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <span>Estudio digital independiente</span>
            <small>Colombia · Disponible globalmente</small>
          </div>
          <HeroPreview />
          <div className="hero-copy">
            <h1><span>Tu idea.</span><span>Tu estilo.</span><span>TuBio.</span></h1>
            <p className="hero-body">{site.hero.body}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {site.hero.primaryAction}
              </a>
              <a className="button button-secondary" href="#servicios">
                {site.hero.secondaryAction}
              </a>
              <ThemeToggle />
            </div>
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
      </section>

      <Section id="servicios" eyebrow="Servicios" title="Soluciones a tu gusto.">
        <div className="card-grid three-columns">
          {site.services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <section id="plantillas" className="portfolio-list-section home-template-inventory">
        <div className="container">
          <div className="portfolio-list-heading">
            <p className="eyebrow">Inventario inicial</p>
            <h2>Plantillas y landings</h2>
          </div>
          <div className="portfolio-grid">
            {landingTemplates.map((landing) => (
              <Link className="portfolio-card" href={landing.href} key={landing.href}>
                <span>{landing.label}</span>
                <h3>{landing.title}</h3>
                <p>{landing.description}</p>
                <strong>{landing.status}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section id="contacto" eyebrow="Ejemplos" title="Permítete antojarte." tone="white">
        <p className="section-lead">Una selección de estructuras que podemos adaptar y convertir en experiencias digitales memorables.</p>
        <LandingWheel />
      </Section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <p>{site.contact.city}</p>
          <a className="footer-logo-link" href="#inicio" aria-label="Volver al inicio"><Image src="/logo-tubio.png" alt="TuBio" width={46} height={46} /></a>
          <FooterShareButton />
        </div>
      </footer>
    </main>
  );
}
