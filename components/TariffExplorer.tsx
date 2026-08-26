"use client";

import { useState } from "react";

type Level = { name: string; description: string; perSecond?: number; perFrame?: number; value?: number };
type Service = { id: string; title: string; category: "Animación" | "Arte"; unit: string; fps?: string; intro: string; levels: Level[] };

const services: Service[] = [
  { id: "storyboard", title: "Storyboard", category: "Animación", unit: "Por cuadro", intro: "La complejidad depende del plano, los personajes y el nivel de definición del fondo.", levels: [
    { name: "Hard", description: "Planos generales o enteros con varios personajes y fondos definidos.", value: 50000 },
    { name: "Medium", description: "Planos con varios personajes o fondos definidos.", value: 35000 },
    { name: "Easy", description: "Primeros planos o planos medios con 1–2 personajes y fondos sencillos.", value: 20000 },
  ]},
  { id: "animatic", title: "Animatic", category: "Animación", unit: "Por segundo", fps: "3 frames aprox. por segundo", intro: "Tarifa única para la construcción temporal del animatic.", levels: [
    { name: "Tarifa", description: "Referencia: 1 segundo equivale a 3 frames aproximadamente.", perSecond: 22000, perFrame: 8000 },
  ]},
  { id: "keys", title: "Keys", category: "Animación", unit: "Por segundo / frame", fps: "14 frames aprox. por segundo", intro: "Frames clave según la acción y cantidad de personajes de la escena.", levels: [
    { name: "Hard", description: "Mucha acción, 2 o más personajes y animación en 1's.", perSecond: 55000, perFrame: 3928.57 },
    { name: "Medium", description: "Acción media, más de 1 personaje y animación en 2's.", perSecond: 40000, perFrame: 2857.14 },
    { name: "Easy", description: "Poca acción, personajes casi estáticos o pequeños; animación en 3's.", perSecond: 33000, perFrame: 2357.14 },
  ]},
  { id: "rough", title: "Rough", category: "Animación", unit: "Por segundo / frame", fps: "24 FPS de referencia", intro: "Animación rough cotizada de acuerdo con los dibujos requeridos por la escena.", levels: [
    { name: "Hard", description: "Mucha acción, 2 o más personajes; más de 12 cuadros por segundo.", perSecond: 90000, perFrame: 3750 },
    { name: "Medium", description: "Acción media, más de 1 personaje; entre 8 y 12 cuadros por segundo.", perSecond: 70000, perFrame: 2916.67 },
    { name: "Easy", description: "Poca o media acción, personajes casi estáticos o pequeños; entre 6 y 8 cuadros por segundo.", perSecond: 55000, perFrame: 2291.67 },
  ]},
  { id: "clean", title: "Clean / Color", category: "Animación", unit: "Por segundo / frame", fps: "24 FPS de referencia", intro: "Limpieza y color: se cobran los dibujos únicos que realmente deben trabajarse.", levels: [
    { name: "Hard", description: "Mucha acción y 2 o más personajes; entre 8 y 12 cuadros por segundo.", perSecond: 60000, perFrame: 2500 },
    { name: "Medium", description: "2 personajes (uno con poca acción) o 1 personaje con poca acción; entre 8 y 12 cuadros.", perSecond: 50000, perFrame: 2083.33 },
    { name: "Easy", description: "Poca acción, personajes casi estáticos, distantes o pequeños; entre 6 y 8 cuadros.", perSecond: 40000, perFrame: 1666.67 },
  ]},
  { id: "color", title: "Solo color", category: "Animación", unit: "Por segundo / frame", fps: "24 FPS de referencia", intro: "Aplicación de color sobre dibujos listos; se cuentan únicamente dibujos únicos.", levels: [
    { name: "Hard", description: "Mucha acción y 2 o más personajes; entre 8 y 12 cuadros por segundo.", perSecond: 24000, perFrame: 1000 },
    { name: "Medium", description: "2 personajes (uno con poca acción) o 1 personaje con poca acción; entre 8 y 12 cuadros.", perSecond: 21000, perFrame: 875 },
    { name: "Easy", description: "Poca acción, personajes casi estáticos, distantes o pequeños; entre 6 y 8 cuadros.", perSecond: 17000, perFrame: 708.33 },
  ]},
  { id: "backgrounds", title: "Backgrounds", category: "Arte", unit: "Por fondo", intro: "Fondos cotizados por complejidad técnica y cantidad de capas.", levels: [
    { name: "Hard", description: "Fondo complejo con varias capas para hacer parallax.", value: 240000 },
    { name: "Medium", description: "Fondo con algunas capas para hacer parallax.", value: 180000 },
    { name: "Easy", description: "Fondo plano o abstracto, de pocas capas y colores.", value: 120000 },
  ]},
  { id: "props", title: "Props", category: "Arte", unit: "Por prop", intro: "Objetos cotizados por detalle, luces y sombras.", levels: [
    { name: "Hard", description: "Prop complejo con detalles, luces y sombras.", value: 110000 },
    { name: "Medium", description: "Prop con detalles y pocas sombras.", value: 80000 },
    { name: "Easy", description: "Prop plano sin muchos detalles.", value: 60000 },
  ]},
];

const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 2 });

export function TariffExplorer() {
  const [filter, setFilter] = useState<"Todas" | "Animación" | "Arte">("Todas");
  const [serviceId, setServiceId] = useState("clean");
  const [levelIndex, setLevelIndex] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const selected = services.find((service) => service.id === serviceId) ?? services[0];
  const level = selected.levels[Math.min(levelIndex, selected.levels.length - 1)];
  const unitPrice = level.perFrame ?? level.value ?? level.perSecond ?? 0;
  const estimate = unitPrice * Math.max(0, quantity || 0);
  const visible = filter === "Todas" ? services : services.filter((service) => service.category === filter);

  return <>
    <section className="mero-explorer" id="tarifas">
      <div className="mero-section-heading">
        <div><span>02 / TARIFAS</span><h2>Encuentra tu servicio</h2></div>
        <p>Todos los valores están expresados en pesos colombianos (COP). Abre cada categoría para revisar alcance, complejidad y unidad de cobro.</p>
      </div>
      <div className="mero-filters" aria-label="Filtrar tarifas">
        {(["Todas", "Animación", "Arte"] as const).map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="mero-accordion">
        {visible.map((service, index) => <details key={service.id} open={index === 0}>
          <summary><span className="mero-service-number">{String(services.indexOf(service) + 1).padStart(2, "0")}</span><span><b>{service.category}</b><strong>{service.title}</strong></span><em>{service.unit}</em><i aria-hidden="true">+</i></summary>
          <div className="mero-detail-body">
            <div className="mero-detail-intro"><p>{service.intro}</p>{service.fps && <span>{service.fps}</span>}</div>
            <div className="mero-rate-list">
              {service.levels.map((item) => <article key={item.name} data-level={item.name.toLowerCase()}><div><small>Complejidad</small><h3>{item.name}</h3><p>{item.description}</p></div><dl>{item.perSecond && <><dt>Por segundo</dt><dd>{cop.format(item.perSecond)}</dd></>}{item.perFrame && <><dt>Por frame</dt><dd>{cop.format(item.perFrame)}</dd></>}{item.value && <><dt>Valor</dt><dd>{cop.format(item.value)}</dd></>}</dl></article>)}
            </div>
          </div>
        </details>)}
      </div>
    </section>

    <section className="mero-calculator" id="calculadora">
      <div className="mero-calculator-copy"><span>03 / ESTIMADOR</span><h2>Haz una cuenta rápida</h2><p>Úsala para dimensionar el trabajo antes de hablar con producción. No reemplaza la cotización aprobada del proyecto.</p></div>
      <div className="mero-calculator-panel">
        <label>Servicio<select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setLevelIndex(0); }}>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label>
        <label>Complejidad<select value={Math.min(levelIndex, selected.levels.length - 1)} onChange={(event) => setLevelIndex(Number(event.target.value))}>{selected.levels.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select></label>
        <label>{level.perFrame ? "Dibujos / frames únicos" : "Cantidad"}<input min="0" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
        <div className="mero-estimate"><small>Estimado orientativo</small><strong>{cop.format(estimate)}</strong><span>{quantity} × {cop.format(unitPrice)}</span></div>
      </div>
    </section>
  </>;
}
