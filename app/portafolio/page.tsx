import Image from "next/image";
import Link from "next/link";
import IllustrationGallery from "@/components/IllustrationGallery";
import ManualCases from "@/components/ManualCases";
import BrandCarousel from "@/components/BrandCarousel";
import PortfolioThemeToggle from "@/components/PortfolioThemeToggle";
import PortfolioScrollIndicator from "@/components/PortfolioScrollIndicator";
import PortfolioShareButton from "@/components/PortfolioShareButton";
import ExperienceCarousel from "@/components/ExperienceCarousel";

export const metadata = {
  title: "Portafolio | Felipe Ramírez",
  description: "Portafolio creativo de Felipe Ramírez: estrategia, identidad, ilustración y producción audiovisual.",
};

const projects = ["Contenido para marcas"];

export default function PortfolioPage() {
  return (
    <main id="inicio" className="raw-portfolio">
      <a className="raw-whatsapp-float" href="https://wa.me/573004318932" target="_blank" rel="noreferrer" aria-label="Escribir a Felipe por WhatsApp">
        <Image src="/images/portfolio/whatsapp.webp" alt="" width={56} height={56} />
      </a>
      <section className="raw-portfolio-hero"><div className="raw-hero-top"><div><p className="raw-date">25 Jul, 2026</p><p className="raw-person">Felipe Gaviria Vásquez</p></div><div className="raw-hero-actions"><p className="raw-contact-data">Medellín, Colombia</p><PortfolioThemeToggle /></div></div><div className="raw-hero-title"><div className="raw-role-title"><span>Estrategia de marca&nbsp;&nbsp; / &nbsp;&nbsp;Dirección creativa&nbsp;&nbsp; / &nbsp;&nbsp;Producción audiovisual</span><a href="mailto:felipegaviria17@hotmail.com">felipegaviria17@hotmail.com</a></div><h1>Portafolio</h1></div><a className="raw-scroll-cue" href="#sobre-mi">Desplazar para explorar <b>?</b></a></section>
      <section id="sobre-mi" className="raw-intro"><div className="raw-intro-identity"><div className="raw-about-heading"><div><p className="raw-label">01 / Sobre mí</p><h2>Hola,<br /><em>soy Felipe.</em></h2></div><div className="raw-pfp-frame"><Image src="/images/portfolio/pfp.jpeg" alt="Felipe Gaviria Vásquez" fill sizes="(max-width: 700px) 160px, 220px" /></div></div><p className="raw-about-role">Ingeniero en Diseño de Entretenimiento Digital. / Estratega de Marca.</p></div><div className="raw-intro-creative"><div className="raw-intro-subtitle"><p className="raw-label">Lo que hago</p><h3>y me gusta hacer.</h3></div><div className="raw-intro-grid"><p>Trabajo entre la estrategia, la sensibilidad visual y la producción. Impulso el crecimiento de empresas desde el audiovisual y el mercadeo: convierto objetivos de marca en contenido, campañas y experiencias que se puedan ver, sentir y recordar.</p><p>Este portafolio reúne algunas de las más recientes exploraciones, donde seguimos aprendiendo, creando experiencias y transformando.</p></div><div className="raw-side-skills"><span>Ilustración</span><span>Presentaciones</span><span>Tipografía</span><span>Identidad de marca</span><span>Dirección de arte</span><span>Desarrollo IA</span><span>Diseño de logos</span><span>Diseño UI</span></div></div></section>
      <section className="raw-experience"><div className="raw-experience-heading"><p className="raw-label">02 / Dónde he trabajado</p><h2>Experiencia.</h2></div><ExperienceCarousel /></section>
      <section className="raw-tools"><p className="raw-label">03 / Herramientas</p><h2>Herramientas<br /><em>a tu servicio.</em></h2><p className="raw-tools-list">After Effects · Reaper Audio · Photoshop · Illustrator · Unity · Blender · Canva · CapCut · IA aplicada a la creación audiovisual, mockups y exploración creativa.</p></section>
      {projects.map((project, index) => <section id={`proyecto-${index + 1}`} className={`raw-project-section raw-project-section-${index + 2}`} key={project}><p className="raw-label">0{index + 5} / Proyecto</p><h2>{project}</h2><p>{project === "Contenido para marcas" ? "Diseño de piezas, campañas y sistemas visuales que conectan la estrategia de cada marca con una presencia reconocible." : "Esta sección queda preparada para desarrollar el proyecto, sus imágenes, proceso, resultados y detalles."}</p>{project === "Contenido para marcas" && <BrandCarousel />}<a href="#inicio">Volver arriba <span>?</span></a></section>)}
      <ManualCases />
      <IllustrationGallery />
      <section id="produccion-audiovisual" className="raw-project-section raw-project-section-1"><p className="raw-label">08 / Producción audiovisual</p><h2>Producción audiovisual</h2><p>Esta sección queda preparada para desarrollar proyectos audiovisuales, proceso, resultados y detalles.</p><a href="#inicio">Volver arriba <span>?</span></a></section>
      <section id="contacto" className="raw-contact"><p className="raw-label">09 / Siguiente proyecto</p><h2>Creemos<br /><em>algo que valga.</em></h2><div className="raw-contact-actions"><a className="raw-whatsapp-link" href="https://wa.me/573004318932" target="_blank" rel="noreferrer"><span>Escríbeme</span><Image className="raw-whatsapp-icon" src="/images/portfolio/whatsapp.webp" alt="" width={28} height={28} /></a><a className="raw-email-link" href="mailto:felipegaviria17@hotmail.com" aria-label="Escribir a Felipe por correo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg></a></div></section>
      <section className="raw-landing-cta"><p className="raw-label">Extra</p><h2>¿Te gustó esta landing?</h2><p>También podemos hablar de crear una para tu marca.</p><a href="https://wa.me/573004318932" target="_blank" rel="noreferrer">Hablemos <span>↗</span></a></section>
      <footer className="raw-portfolio-footer"><span>Felipe Gaviria Vásquez</span><a href="#inicio">Volver arriba</a><span>Colombia / 2026</span></footer>
    </main>
  );
}