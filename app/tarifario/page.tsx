import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/Header";
import { TariffExplorer } from "@/components/TariffExplorer";

export const metadata: Metadata = {
  title: "Tarifario 2026 | MERO Estudio",
  description: "Tarifas 2026 para proveedores de animación y arte de MERO Estudio.",
};

const paymentGuide = "https://docs.google.com/presentation/d/1zjSUb2coF0Ou2zFqgXX6V4f_2KpSblqmCx33EbqEJVg/edit?slide=id.p#slide=id.p";

export default function TarifarioPage() {
  return <main className="mero-page">
    <Header />
    <section className="mero-hero">
      <div className="mero-hero-grid">
        <div className="mero-hero-copy"><span className="mero-kicker">MERO ESTUDIO / PROVEEDORES</span><h1>Tarifario<br /><em>2026</em></h1><p>Una guía transparente para entender cuánto vale cada parte del proceso y cómo trabajamos juntos.</p><div className="mero-hero-actions"><a href="#tarifas">Ver tarifas <span>↓</span></a><a href="#como-trabajamos">Cómo trabajamos</a></div></div>
        <div className="mero-hero-art" aria-hidden="true"><Image src="/images/mero/logo-mero.png" alt="" fill priority sizes="(max-width: 760px) 90vw, 48vw" /></div>
        <div className="mero-edition"><span>Edición</span><strong>01</strong><small>COP · Colombia</small></div>
      </div>
    </section>

    <section className="mero-rules" id="como-trabajamos">
      <div className="mero-section-heading"><div><span>01 / ANTES DE EMPEZAR</span><h2>Así contamos el trabajo</h2></div><p>Una misma escena puede repetir un dibujo muchas veces. MERO paga el trabajo creativo real: cada dibujo unitario que el proveedor debe producir.</p></div>
      <div className="mero-rule-grid">
        <article className="mero-rule-feature"><span>Regla clave</span><h3>Un dibujo único<br />se cuenta <em>una vez.</em></h3><p>Si un frame se repite, forma un loop o permanece en pantalla, no se multiplica artificialmente. En clean y color cuenta cada dibujo diferente que requiere intervención.</p></article>
        <article><b>FPS ≠ dibujos nuevos</b><p>Los frames por segundo indican la cadencia de la escena. La tarifa final depende de cuántos dibujos únicos exige realmente.</p></article>
        <article><b>Complejidad acordada</b><p>Hard, Medium y Easy se definen por acción, personajes, plano y detalle. Producción confirma el nivel antes de iniciar.</p></article>
        <article><b>Presupuesto cuidado</b><p>No cobramos duplicados, holds ni repeticiones como trabajo nuevo. Así protegemos el presupuesto sin devaluar tu oficio.</p></article>
      </div>
    </section>

    <TariffExplorer />

    <section className="mero-process">
      <div className="mero-section-heading"><div><span>04 / FLUJO DE PAGO</span><h2>Del encargo al pago</h2></div><p>Las condiciones específicas se confirman por proyecto. Conserva siempre los soportes y datos enviados a producción.</p></div>
      <ol><li><span>01</span><div><b>Recibes el proyecto</b><p>Producción comparte alcance, escena, complejidad y fechas.</p></div></li><li><span>02</span><div><b>Confirmas la tarifa</b><p>Revisamos dibujos únicos, FPS de referencia y entregables.</p></div></li><li><span>03</span><div><b>Entregas y finalizas</b><p>El proyecto debe quedar aprobado para entrar al ciclo de pago.</p></div></li><li><span>04</span><div><b>Pago antes de un mes</b><p>El pago se realiza dentro del mes siguiente a la finalización del proyecto.</p></div></li></ol>
      <a className="mero-guide-link" href={paymentGuide} target="_blank" rel="noopener noreferrer"><span>Ver tutorial de pagos</span><b>ABRIR GUÍA ↗</b></a>
    </section>

    <footer className="mero-footer"><Image src="/images/mero/logo-mero.png" alt="MERO Estudio" width={110} height={110} /><p>Tarifario para proveedores · 2026<br />Valores expresados en COP</p><Link href="/">Volver a TuBio</Link></footer>
  </main>;
}
