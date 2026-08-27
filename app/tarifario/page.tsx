import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { MeroHeroLogo, MeroShareButton } from "@/components/MeroHeroLogo";
import { TariffExplorer } from "@/components/TariffExplorer";

export const metadata: Metadata = {
  title: "Tarifario 2026 | MERO Estudio",
  description: "Tarifas 2026 para proveedores de animación y arte de MERO Estudio.",
  openGraph: {
    title: "Tarifario 2026 | MERO Estudio",
    description: "Tarifas 2026 para proveedores de animación y arte de MERO Estudio.",
    url: "/tarifario",
    type: "website",
  },
};

const paymentGuide = "https://docs.google.com/presentation/d/1zjSUb2coF0Ou2zFqgXX6V4f_2KpSblqmCx33EbqEJVg/edit?slide=id.p#slide=id.p";
const paymentTemplate = "https://docs.google.com/document/d/1EfvSR32QKMCfJ3W6CA7GDRM8Pinrov8-UsKTjTwjlRA/edit?usp=sharing";

export default function TarifarioPage() {
  return <main className="mero-page" id="inicio">
    <Header />
    <section className="mero-hero">
      <div className="mero-hero-grid">
        <MeroShareButton />
        <div className="mero-hero-copy"><span className="mero-kicker">MERO ESTUDIO / PROVEEDORES</span><h1>Tarifario<br /><em>2026</em></h1><p className="mero-hero-note">Antes de trabajar juntos, dale una lectura atenta.<span>Aquí cuidamos tu trabajo y el proyecto.</span></p></div>
        <MeroHeroLogo />
      </div>
    </section>

    <TariffExplorer />

    <section className="mero-rules" id="como-trabajamos">
      <div className="mero-section-heading"><div><h2>Antes de empezar</h2></div><p>Ten en cuenta si eres animador.</p></div>
      <div className="mero-rule-grid">
        <article className="mero-rule-feature"><span>Regla clave</span><h3>Un dibujo<br />se cuenta <em>una vez.</em></h3><p>Si un frame se repite, forma un loop o permanece en pantalla, no se multiplica artificialmente. En clean y color cuenta cada dibujo diferente que requiere intervención.</p></article>
        <article><b>FPS ≠ dibujos nuevos</b><p>Los frames por segundo indican la cadencia de la escena. La tarifa final depende de cuántos dibujos únicos exige realmente.</p></article>
        <article><b>Complejidad acordada</b><p>Hard, Medium y Easy se definen por acción, personajes, plano y detalle. Producción confirma el nivel antes de iniciar.</p></article>
        <article><b>Presupuesto cuidado</b><p>No cobramos duplicados, holds ni repeticiones como trabajo nuevo. Así protegemos el presupuesto sin devaluar tu oficio.</p></article>
        <article><b>Valoramos tu trabajo</b><p>Nuestros valores están ajustados a precios de la industria y valoramos mucho tu intención.</p></article>
      </div>
    </section>

    <section className="mero-process">
      <div className="mero-section-heading"><div><h2>¿Y cuándo pagan?</h2></div></div>
      <ol><li><span>01</span><div><b>Recibes el proyecto</b><p>Producción comparte alcance, escena, complejidad, tarifa y fechas.</p></div></li><li><span>02</span><div><b>Entregas y finalizas</b><p>El proyecto debe quedar entregado y aprobado para entrar al ciclo de pago.</p></div></li><li><span>03</span><div><b>Subes tu cuenta de cobro</b><p>Usa la plantilla indicada. Para tarifas en USD se aplica la TRM vigente del día en que la subas.</p></div></li><li><span>04</span><div><b>Realizamos el pago</b><p>Hacemos el pago dentro del mes siguiente a la entrega y finalización del proyecto.</p></div></li></ol>
      <a className="mero-template-cta" href={paymentTemplate} target="_blank" rel="noopener noreferrer"><span>Plantilla de cuenta de cobro</span><b>ABRIR DOCUMENTO</b></a>
      <p className="mero-payment-note">MERO no retiene dinero a voluntad. En cada negociación con nuestros clientes procuramos resolver pagos y novedades lo antes posible.</p>
      <p className="mero-guide-question">¿Te queda alguna duda?</p>
      <a className="mero-guide-link" href={paymentGuide} target="_blank" rel="noopener noreferrer"><span>Ver tutorial de pagos</span><b>ABRIR GUÍA</b></a>
    </section>

  </main>;
}
