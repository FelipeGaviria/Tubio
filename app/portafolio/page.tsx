import Link from "next/link";

export const metadata = {
  title: "Portafolio | Felipe Ramírez",
  description: "Portafolio creativo de Felipe Ramírez: estrategia, identidad, ilustración y producción audiovisual.",
};

const disciplines = ["Producción audiovisual", "Estrategia de marca", "Impacto y concepto", "Ilustración"];
const projects = ["Producción audiovisual", "Estrategia de marca", "Impacto y concepto", "Ilustración"];

export default function PortfolioPage() {
  return (
    <main id="inicio" className="raw-portfolio">
      <div className="raw-scroll-controls" aria-label="Controles de desplazamiento"><a href="#inicio" aria-label="Subir">↑</a><a href="#contacto" aria-label="Bajar">↓</a></div><header className="raw-portfolio-header"><Link href="/">TuBio</Link><nav><a href="#sobre-mi">Sobre mí</a><a href="#trabajo">Trabajo</a><a href="#contacto">Contacto</a></nav><span>2026 / Portfolio</span></header>
      <section className="raw-portfolio-hero"><div className="raw-hero-top"><div><p className="raw-date">25 Jul, 2026</p><p className="raw-person">Felipe Gaviria Vásquez</p></div><p className="raw-contact-data">Medellín,<br />Colombia</p></div><div className="raw-hero-title"><p className="raw-role-title">Estrategia de marca&nbsp;&nbsp; / &nbsp;&nbsp;Dirección creativa&nbsp;&nbsp; / &nbsp;&nbsp;Producción audiovisual</p><h1>Portfolio</h1></div><a className="raw-scroll-cue" href="#sobre-mi">Desplazar para explorar <b>↓</b></a></section>
      <section id="sobre-mi" className="raw-intro"><p className="raw-label">01 / Sobre mí</p><h2>Hola,<br /><em>soy Felipe.</em></h2><p className="raw-about-role">Medellín / Colombia · Estratega, director creativo y constructor de ideas.</p><div className="raw-intro-subtitle"><p className="raw-label">Lo que hago</p><h3>y me gusta hacer.</h3></div><div className="raw-intro-grid"><p>Trabajo entre la estrategia, la sensibilidad visual y la producción. Me interesa encontrar la idea que ordena un proyecto y convertirla en algo que se pueda ver, sentir y recordar.</p><p>Este portafolio reúne algunas de las más recientes exploraciones, donde seguimos aprendiendo, creando experiencias y transformando.</p></div></section>
      <section className="raw-experience"><p className="raw-label">02 / Trayectoria</p><h2>Dónde he<br /><em>trabajado.</em></h2><div className="raw-experience-line"><span>01</span><p>Empresa, estudio o colaboración</p><small>Rol / periodo</small></div><div className="raw-experience-line"><span>02</span><p>Empresa, estudio o colaboración</p><small>Rol / periodo</small></div><div className="raw-experience-line"><span>03</span><p>Empresa, estudio o colaboración</p><small>Rol / periodo</small></div></section>
      <section className="raw-tools"><p className="raw-label">03 / Herramientas que domino</p><h2>Las herramientas<br /><em>que me acompañan.</em></h2><p>After Effects · Photoshop · Illustrator · Canva</p></section><section className="raw-disciplines"><p className="raw-label">04 / Ramas de trabajo</p><div className="raw-discipline-list">{disciplines.map((item, index) => <div key={item}><span>0{index + 1}</span><h3>{item}</h3><b>↗</b></div>)}</div></section>
      <section id="trabajo" className="raw-work"><div className="raw-section-heading"><p className="raw-label">05 / Lo que vas a encontrar aquí</p><h2>Ideas que toman<br /><em>distintas formas.</em></h2></div><div className="raw-project-grid">{projects.map((project, index) => <a href={`#proyecto-${index + 1}`} key={project} className={`raw-project raw-project-${index + 1}`}><div className="raw-project-placeholder"><span>Imagen / video</span></div><div className="raw-project-info"><small>0{index + 1}</small><h3>{project}</h3><p>Explorar sección <b>↓</b></p></div></a>)}</div></section>
      
      <section id="contacto" className="raw-contact"><p className="raw-label">06 / Siguiente proyecto</p><h2>Hablemos de<br /><em>algo bueno.</em></h2><a href="mailto:hola@tubio.co">hola@tubio.co <span>↗</span></a></section>
      <footer className="raw-portfolio-footer"><span>Felipe Gaviria Vásquez / TuBio</span><Link href="/">Volver a inicio</Link><span>Colombia / 2026</span></footer>
    </main>
  );
}