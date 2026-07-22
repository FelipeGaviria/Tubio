import Link from "next/link";

export const metadata = { title: "Portafolio", description: "Portafolio personal y selección de proyectos de TuBio." };

const projects = ["Dirección creativa", "Estrategia digital", "Identidad de marca"];

export default function PersonalPortfolioPage() {
  return <main className="personal-portfolio"><header><Link href="/">TB</Link><span>Portafolio / TuBio</span></header><section className="personal-portfolio-hero"><p className="eyebrow">Hola, soy Felipe</p><h1>Ideas que encuentran<br /><em>su forma.</em></h1><p>Este es mi espacio para reunir proyectos, experimentos y colaboraciones digitales.</p><a href="mailto:hola@tubio.co">Hablemos <span>→</span></a></section><section className="personal-portfolio-list"><p className="eyebrow">En lo que trabajo</p>{projects.map((project, index) => <article key={project}><span>0{index + 1}</span><h2>{project}</h2><b>+</b></article>)}</section><footer><Link href="/">Volver a TuBio</Link><span>Colombia / 2026</span></footer></main>;
}