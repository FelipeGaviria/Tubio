import Link from "next/link";

import { Header } from "@/components/Header";
import { LandingWheel } from "@/components/LandingWheel";

const landings = [
  {
    label: "Template 1",
    title: "Landing dark glass para marca tecnica",
    description: "Una primera base visual con presencia nocturna, acentos cyan y bloques listos para reemplazar por una marca real.",
    href: "/template-1",
    status: "Base editable",
  },
  {
    label: "Template 2",
    title: "Tarjeta bio editorial con contactos directos",
    description: "Una experiencia tipo tarjeta digital inspirada en perfiles profesionales: identidad, enlaces, guardar contacto y compartir.",
    href: "/template-2",
    status: "Base editable",
  },
  {
    label: "Template 3",
    title: "Landing editorial de narrativa visual",
    description: "Una composicion calida para marcas con historia, producto y una experiencia memorable.",
    href: "/template-3",
    status: "Nueva exploracion",
  },
  {
    label: 'Template 4',
    title: 'Biolink con parallax suave y datos personales',
    description: 'Una tarjeta de perfil pensada para reunir enlaces, trabajo y personalidad en una experiencia con movimiento.',
    href: '/template-4',
    status: 'Experimento visual',
  },
];

export default function PortafolioPage() {
  return (
    <main className="portfolio-page">
      <Header />

      <section className="portfolio-hero">
        <div className="container portfolio-hero-grid">
          <div>
            <p className="eyebrow">Landings</p>
            <h1>Landings separadas, cada una con su propia identidad.</h1>
            <p className="portfolio-lead">
              Este sera el lugar para guardar muestras, plantillas y paginas de clientes. Cada landing puede tener sus propios colores, logos, textos, componentes y direccion visual sin depender de la home de TuBio.
            </p>
          </div>
          <div className="portfolio-note" aria-label="Estado del portafolio">
            <span>01</span>
            <strong>Primera landing lista para editar</strong>
            <p>La estructura esta cruda a proposito: sirve como tablero inicial para crecer con marcas reales.</p>
          </div>
        </div>
      </section>

      <section className="portfolio-list-section">
        <div className="container">
          <div className="portfolio-list-heading">
            <p className="eyebrow">Inventario inicial</p>
            <h2>Plantillas y landings</h2>
          </div>

          <div className="portfolio-grid">
            {landings.map((landing) => (
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

      <section className="section section-white">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Ruleta de ejemplos</p>
            <h2>Explora posibilidades para cada tipo de cliente.</h2>
            <p className="section-lead">Una selección de estructuras que podemos adaptar y convertir en landings reales.</p>
          </div>
          <LandingWheel />
        </div>
      </section>`n    </main>
  );
}
