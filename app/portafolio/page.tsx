import Image from "next/image";
import Link from "next/link";
import IllustrationGallery from "@/components/IllustrationGallery";
import ManualCases from "@/components/ManualCases";
import BrandCarousel from "@/components/BrandCarousel";
import PortfolioThemeToggle from "@/components/PortfolioThemeToggle";
import PortfolioScrollIndicator from "@/components/PortfolioScrollIndicator";
import ExperienceCarousel from "@/components/ExperienceCarousel";

export const metadata = {
  title: "Portafolio | Felipe RamÃ­rez",
  description: "Portafolio creativo de Felipe RamÃ­rez: estrategia, identidad, ilustraciÃ³n y producciÃ³n audiovisual.",
};

const projects = ["Contenido para marcas"];

export default function PortfolioPage() {
  return (
    <main id="inicio" className="raw-portfolio">
      <a className="raw-whatsapp-float" href="https://wa.me/573004318932" target="_blank" rel="noreferrer" aria-label="Escribir a Felipe por WhatsApp">
        <Image src="/images/portfolio/whatsapp.webp" alt="" width={56} height={56} />
      </a>
      <section className="raw-portfolio-hero"><div className="raw-hero-top"><div><p className="raw-date">25 Jul, 2026</p><p className="raw-person">Felipe Gaviria VÃ¡squez</p></div><div className="raw-hero-actions"><p className="raw-contact-data">MedellÃ­n, Colombia</p><PortfolioThemeToggle /></div></div><div className="raw-hero-title"><div className="raw-role-title"><span>Estrategia de marca&nbsp;&nbsp; / &nbsp;&nbsp;DirecciÃ³n creativa&nbsp;&nbsp; / &nbsp;&nbsp;ProducciÃ³n audiovisual</span><a href="mailto:felipegaviria17@hotmail.com">felipegaviria17@hotmail.com</a></div><h1>Portafolio</h1></div><a className="raw-scroll-cue" href="#sobre-mi">Desplazar para explorar <b>?</b></a></section>
      <section id="sobre-mi" className="raw-intro"><div className="raw-intro-identity"><div className="raw-about-heading"><div><p className="raw-label">01 / Sobre mÃ­</p><h2>Hola,<br /><em>soy Felipe.</em></h2></div><div className="raw-pfp-frame"><Image src="/images/portfolio/pfp.jpeg" alt="Felipe Gaviria VÃ¡squez" fill sizes="(max-width: 700px) 160px, 220px" /></div></div><p className="raw-about-role">Ingeniero en DiseÃ±o de Entretenimiento Digital. / Estratega de Marca.</p></div><div className="raw-intro-creative"><div className="raw-intro-subtitle"><p className="raw-label">Lo que hago</p><h3>y me gusta hacer.</h3></div><div className="raw-intro-grid"><p>Trabajo entre la estrategia, la sensibilidad visual y la producciÃ³n. Impulso el crecimiento de empresas desde el audiovisual y el mercadeo: convierto objetivos de marca en contenido, campaÃ±as y experiencias que se puedan ver, sentir y recordar.</p><p>Este portafolio reÃºne algunas de las mÃ¡s recientes exploraciones, donde seguimos aprendiendo, creando experiencias y transformando.</p></div><div className="raw-side-skills"><span>IlustraciÃ³n</span><span>Presentaciones</span><span>TipografÃ­a</span><span>Identidad de marca</span><span>DirecciÃ³n de arte</span><span>MaquetaciÃ³n</span><span>DiseÃ±o de logos</span><span>DiseÃ±o UI</span></div></div></section>
      <section className="raw-experience"><div className="raw-experience-heading"><p className="raw-label">02 / DÃ³nde he trabajado</p><h2>Experiencia.</h2></div><ExperienceCarousel /></section>
      <section className="raw-tools"><p className="raw-label">03 / Herramientas</p><h2>Herramientas<br /><em>a tu servicio.</em></h2><p className="raw-tools-list">After Effects Â· Reaper Audio Â· Photoshop Â· Illustrator Â· Unity Â· Blender Â· Canva Â· CapCut Â· IA aplicada a la creaciÃ³n audiovisual, mockups y exploraciÃ³n creativa.</p></section>
      {projects.map((project, index) => <section id={`proyecto-${index + 1}`} className={`raw-project-section raw-project-section-${index + 2}`} key={project}><p className="raw-label">0{index + 5} / Proyecto</p><h2>{project}</h2><p>{project === "Contenido para marcas" ? "DiseÃ±o de piezas, campaÃ±as y sistemas visuales que conectan la estrategia de cada marca con una presencia reconocible." : "Esta secciÃ³n queda preparada para desarrollar el proyecto, sus imÃ¡genes, proceso, resultados y detalles."}</p>{project === "Contenido para marcas" && <BrandCarousel />}<a href="#inicio">Volver arriba <span>?</span></a></section>)}
      <ManualCases />
      <IllustrationGallery />
      <section id="produccion-audiovisual" className="raw-project-section raw-project-section-1"><p className="raw-label">08 / ProducciÃ³n audiovisual</p><h2>ProducciÃ³n audiovisual</h2><p>Esta secciÃ³n queda preparada para desarrollar proyectos audiovisuales, proceso, resultados y detalles.</p><a href="#inicio">Volver arriba <span>?</span></a></section>
      <section id="contacto" className="raw-contact"><p className="raw-label">09 / Siguiente proyecto</p><h2>Creemos<br /><em>algo que valga.</em></h2><div className="raw-contact-actions"><a className="raw-whatsapp-link" href="https://wa.me/573004318932" target="_blank" rel="noreferrer"><span>EscrÃ­beme</span><Image className="raw-whatsapp-icon" src="/images/portfolio/whatsapp.webp" alt="" width={28} height={28} /></a><a className="raw-email-link" href="mailto:felipegaviria17@hotmail.com" aria-label="Escribir a Felipe por correo"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg></a></div></section>
      <footer className="raw-portfolio-footer"><span>Felipe Gaviria VÃ¡squez</span><a href="#inicio">Volver arriba</a><span>Colombia / 2026</span></footer>
    </main>
  );
}