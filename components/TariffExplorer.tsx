"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Level = { name: string; description: string; perSecond?: number; perFrame?: number; value?: number };
type Service = { id: string; title: string; category: "Animación" | "Arte"; unit: string; fps?: string; intro: string; levels: Level[]; baseCurrency?: "USD" };
type Currency = "USD" | "COP";

const REFERENCE_TRM = 3081.67;

const initialServices: Service[] = [
  { id: "storyboard", title: "Storyboard", category: "Animación", unit: "Por cuadro", intro: "La complejidad depende del plano, los personajes y el nivel de definición del fondo.", levels: [
    { name: "Hard", description: "Planos generales o enteros con varios personajes y fondos definidos.", value: 16 },
    { name: "Medium", description: "Planos con varios personajes o fondos definidos.", value: 12 },
    { name: "Easy", description: "Primeros planos o planos medios con 1–2 personajes y fondos sencillos.", value: 8 },
  ]},
  { id: "animatic", title: "Animatic", category: "Animación", unit: "Por segundo", fps: "3 frames aprox. por segundo", intro: "Tarifa única para la construcción temporal del animatic.", levels: [
    { name: "Tarifa", description: "Referencia: 1 segundo equivale a 3 frames aproximadamente.", perSecond: 6, perFrame: 2 },
  ]},
  { id: "keys", title: "Keys", category: "Animación", unit: "Por segundo / frame", fps: "14 frames aprox. por segundo", intro: "Frames clave según la acción y cantidad de personajes de la escena.", levels: [
    { name: "Hard", description: "Mucha acción, 2 o más personajes y animación en 1's.", perSecond: 18, perFrame: 1 },
    { name: "Medium", description: "Acción media, más de 1 personaje y animación en 2's.", perSecond: 13, perFrame: 1 },
    { name: "Easy", description: "Poca acción, personajes casi estáticos o pequeños; animación en 3's.", perSecond: 11, perFrame: 1 },
  ]},
  { id: "rough", title: "Rough", category: "Animación", unit: "Por segundo / frame", fps: "24 FPS de referencia", intro: "Animación rough cotizada de acuerdo con los dibujos requeridos por la escena.", levels: [
    { name: "Hard", description: "Mucha acción, 2 o más personajes; más de 12 cuadros por segundo.", perSecond: 30, perFrame: 30 / 24 },
    { name: "Medium", description: "Acción media, más de 1 personaje; entre 8 y 12 cuadros por segundo.", perSecond: 24, perFrame: 24 / 24 },
    { name: "Easy", description: "Poca o media acción, personajes casi estáticos o pequeños; entre 6 y 8 cuadros por segundo.", perSecond: 18, perFrame: 18 / 24 },
  ]},
  { id: "clean", title: "Clean / Color", category: "Animación", unit: "Por segundo / frame", fps: "24 FPS de referencia", intro: "Limpieza y color: se cobran los dibujos únicos que realmente deben trabajarse.", levels: [
    { name: "Hard", description: "Mucha acción y 2 o más personajes; entre 8 y 12 cuadros por segundo.", perSecond: 18, perFrame: 18 / 24 },
    { name: "Medium", description: "2 personajes (uno con poca acción) o 1 personaje con poca acción; entre 8 y 12 cuadros.", perSecond: 15, perFrame: 15 / 24 },
    { name: "Easy", description: "Poca acción, personajes casi estáticos, distantes o pequeños; entre 6 y 8 cuadros.", perSecond: 12, perFrame: 12 / 24 },
  ]},
  { id: "color", title: "Solo color", category: "Animación", unit: "Por segundo / frame", fps: "24 FPS de referencia", intro: "Aplicación de color sobre dibujos listos; se cuentan únicamente dibujos únicos.", levels: [
    { name: "Hard", description: "Mucha acción y 2 o más personajes; entre 8 y 12 cuadros por segundo.", perSecond: 8, perFrame: 8 / 24 },
    { name: "Medium", description: "2 personajes (uno con poca acción) o 1 personaje con poca acción; entre 8 y 12 cuadros.", perSecond: 7, perFrame: 7 / 24 },
    { name: "Easy", description: "Poca acción, personajes casi estáticos, distantes o pequeños; entre 6 y 8 cuadros.", perSecond: 5, perFrame: 5 / 24 },
  ]},
  { id: "backgrounds", title: "Backgrounds", category: "Arte", unit: "Por fondo", intro: "Fondos cotizados por complejidad técnica y cantidad de capas.", levels: [
    { name: "Hard", description: "Fondo complejo con varias capas para hacer parallax.", value: 80 },
    { name: "Medium", description: "Fondo con algunas capas para hacer parallax.", value: 60 },
    { name: "Easy", description: "Fondo plano o abstracto, de pocas capas y colores.", value: 40 },
  ]},
  { id: "props", title: "Props", category: "Arte", unit: "Por prop", intro: "Objetos cotizados por detalle, luces y sombras.", levels: [
    { name: "Hard", description: "Prop complejo con detalles, luces y sombras.", value: 36 },
    { name: "Medium", description: "Prop con detalles y pocas sombras.", value: 26 },
    { name: "Easy", description: "Prop plano sin muchos detalles.", value: 19 },
  ]},
].map((service) => ({ ...service, baseCurrency: "USD" as const })) as Service[];

const formatters = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }),
  COP: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }),
};
const copAmount = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 2 }).format(value);
const supabaseUrl = "https://qdxapfnjizissxgkhpxi.supabase.co";
const publishableKey = "sb_publishable_VBhZcIj3KS9r1nxTaovmBA_QrVQzNzC";

export function TariffExplorer() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [trm, setTrm] = useState(REFERENCE_TRM);
  const [trmDate, setTrmDate] = useState("26 ago 2026");
  const [filter, setFilter] = useState<"Todas" | "Animación" | "Arte">("Todas");
  const [serviceId, setServiceId] = useState("clean");
  const [levelIndex, setLevelIndex] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [cadences, setCadences] = useState<Record<string, 8 | 12 | 24>>({ rough: 24, clean: 24, color: 24 });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [editorStatus, setEditorStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const beforeEdit = useRef<Service[]>(initialServices);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${supabaseUrl}/rest/v1/mero_tariff_config?id=eq.current&select=services`, {
      headers: { apikey: publishableKey }, signal: controller.signal,
    }).then((response) => response.ok ? response.json() : Promise.reject())
      .then((rows: Array<{ services?: Service[] }>) => {
        if (Array.isArray(rows[0]?.services)) {
          const remote = rows[0].services!;
          const normalized = remote.every((service) => service.baseCurrency === "USD") ? remote : remote.map((service) => ({
            ...service,
            baseCurrency: "USD" as const,
            levels: service.levels.map((item) => ({
              ...item,
              perSecond: item.perSecond === undefined ? undefined : Math.max(1, Math.round(item.perSecond / REFERENCE_TRM)),
              perFrame: item.perFrame === undefined ? undefined : item.perFrame / REFERENCE_TRM,
              value: item.value === undefined ? undefined : Math.max(1, Math.round(item.value / REFERENCE_TRM)),
            })),
          }));
          requestAnimationFrame(() => setServices(normalized));
        }
      }).catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/trm", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { value?: number; dateLabel?: string }) => {
        if (typeof data.value === "number" && data.value > 0) setTrm(data.value);
        if (data.dateLabel) setTrmDate(data.dateLabel);
      }).catch(() => undefined);
    return () => controller.abort();
  }, []);

  const unlockEditor = () => {
    if (editorCode !== "696969") { setEditorStatus("Código incorrecto."); return; }
    beforeEdit.current = structuredClone(services);
    setEditing(true); setEditorOpen(false); setEditorStatus("");
  };
  const changeRate = (serviceIndex: number, itemIndex: number, key: "perSecond" | "perFrame" | "value", next: number) => {
    setServices((current) => current.map((service, sIndex) => sIndex !== serviceIndex ? service : {
      ...service, levels: service.levels.map((item, lIndex) => lIndex !== itemIndex ? item : { ...item, [key]: Math.max(0, next || 0) }),
    }));
  };
  const saveRates = async () => {
    setSaving(true); setEditorStatus("");
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/update-mero-tariffs`, {
        method: "POST", headers: { "Content-Type": "application/json", apikey: publishableKey },
        body: JSON.stringify({ code: editorCode, services }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No se pudo guardar");
      setEditorStatus("Tarifas actualizadas para todos los usuarios."); setEditing(false); setEditorCode("");
    } catch (error) { setEditorStatus(error instanceof Error ? error.message : "No se pudo guardar"); }
    finally { setSaving(false); }
  };
  const selected = services.find((service) => service.id === serviceId) ?? services[0];
  const level = selected.levels[Math.min(levelIndex, selected.levels.length - 1)];
  const visible = filter === "Todas" ? services : services.filter((service) => service.category === filter);
  const ratePerSecond = (service: Service, item: Level) => service.fps === "24 FPS de referencia" && item.perSecond !== undefined ? item.perSecond * ((cadences[service.id] ?? 24) / 24) : item.perSecond;
  const ratePerFrame = (service: Service, item: Level) => {
    if (item.perSecond === undefined) return item.perFrame;
    const referenceFps = service.fps === "24 FPS de referencia" ? 24 : Number(service.fps?.match(/\d+/)?.[0]);
    return referenceFps > 0 ? item.perSecond / referenceFps : item.perFrame;
  };
  const convert = (value: number) => currency === "COP" ? Math.round(value * trm) : value;
  const money = (value: number) => formatters[currency].format(convert(value));
  const displayUnitPrice = level.perFrame !== undefined ? ratePerFrame(selected, level)! : level.value ?? level.perSecond ?? 0;
  const estimate = displayUnitPrice * Math.max(0, quantity || 0);

  return <>
    <section className="mero-explorer" id="tarifas">
      <div className="mero-section-heading">
        <div><h2>Tarifas</h2></div>
        <div className="mero-currency-panel">
          <div className="mero-currency-toggle" aria-label="Moneda de visualización">{(["COP", "USD"] as const).map((item) => <button type="button" className={currency === item ? "active" : ""} key={item} onClick={() => setCurrency(item)}>{item === "COP" ? "Pesos COP" : "Dólares USD"}</button>)}</div>
          <p><strong>{currency}</strong><span>{currency === "COP" ? `Conversión automática con TRM de ${copAmount(trm)} · ${trmDate}.` : "Valores base en dólares enteros, sin fluctuaciones diarias."}</span></p>
        </div>
      </div>
      <div className="mero-filters" aria-label="Filtrar tarifas">
        {(["Todas", "Animación", "Arte"] as const).map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="mero-accordion">
        {visible.map((service) => <details key={service.id}>
          <summary><span className="mero-service-number">{String(services.indexOf(service) + 1).padStart(2, "0")}</span><span><b>{service.category}</b><strong>{service.title}</strong></span><em>{service.unit}</em><i aria-hidden="true">+</i></summary>
          <div className="mero-detail-body">
            <div className="mero-detail-intro"><p>{service.intro}</p>{service.fps === "24 FPS de referencia" ? <div className="mero-cadence" aria-label={`Cadencia de ${service.title}`}>{([{ label: "Animación a 1s", fps: 24 }, { label: "2s", fps: 12 }, { label: "3s", fps: 8 }] as const).map((option) => <button type="button" className={(cadences[service.id] ?? 24) === option.fps ? "active" : ""} key={option.fps} onClick={() => setCadences((current) => ({ ...current, [service.id]: option.fps }))}><b>{option.label}</b><small>{option.fps} FPS</small></button>)}</div> : service.fps && <span>{service.fps}</span>}</div>
            <div className="mero-rate-list">
              {service.levels.map((item, itemIndex) => <article key={item.name} data-level={item.name.toLowerCase()}><div><small>Complejidad</small><h3>{item.name}</h3><p>{item.description}</p></div><dl>
                {ratePerSecond(service, item) !== undefined && <div><dt>{editing && service.fps === "24 FPS de referencia" ? "Base 24 FPS" : "Por segundo"} · {currency}</dt><dd>{editing ? <input aria-label={`${service.title} ${item.name} por segundo en USD`} type="number" min="0" step="1" value={item.perSecond} onChange={(event) => changeRate(services.indexOf(service), itemIndex, "perSecond", Math.round(Number(event.target.value)))} /> : money(ratePerSecond(service, item)!)}</dd></div>}
                {item.perFrame !== undefined && <div><dt>Por frame · {currency}</dt><dd>{money(ratePerFrame(service, item)!)}</dd></div>}
                {item.value !== undefined && <div><dt>Valor · {currency}</dt><dd>{editing ? <input aria-label={`${service.title} ${item.name} valor en USD`} type="number" min="0" step="1" value={item.value} onChange={(event) => changeRate(services.indexOf(service), itemIndex, "value", Math.round(Number(event.target.value)))} /> : money(item.value)}</dd></div>}
              </dl></article>)}
            </div>
          </div>
        </details>)}
      </div>
    </section>

    <section className="mero-calculator" id="calculadora">
      <div className="mero-calculator-copy"><h2>Haz una cuenta rápida</h2><p>Úsala para dimensionar el trabajo antes de hablar con producción. No reemplaza la cotización aprobada del proyecto.</p></div>
      <div className="mero-calculator-panel">
        <label>Servicio<select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setLevelIndex(0); }}>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label>
        <label>Complejidad<select value={Math.min(levelIndex, selected.levels.length - 1)} onChange={(event) => setLevelIndex(Number(event.target.value))}>{selected.levels.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select></label>
        <label>{level.perFrame ? "Dibujos / frames únicos" : "Cantidad"}<input min="0" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
        <div className="mero-estimate"><small>Estimado orientativo · {currency}</small><strong>{money(estimate)}</strong><span>{quantity} × {money(displayUnitPrice)}</span></div>
      </div>
    </section>

    {editorOpen && <div className="mero-editor-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}><div className="mero-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title"><button className="mero-editor-close" type="button" onClick={() => setEditorOpen(false)} aria-label="Cerrar">×</button><small>Acceso restringido</small><h2 id="editor-title">Editar tarifas</h2><p>Ingresa el código de seis dígitos para habilitar los campos.</p><label>Código<input type="password" inputMode="numeric" maxLength={6} value={editorCode} onChange={(event) => setEditorCode(event.target.value.replace(/\D/g, ""))} onKeyDown={(event) => { if (event.key === "Enter") unlockEditor(); }} autoFocus /></label>{editorStatus && <span className="mero-editor-error">{editorStatus}</span>}<button type="button" onClick={unlockEditor}>Desbloquear</button></div></div>}
    <footer className="mero-footer"><div className="mero-footer-center"><Image src="/images/mero/logo-mero.png" alt="MERO Estudio" width={132} height={132} /><div className={`mero-editor-dock ${editing ? "is-editing" : ""}`}>{editorStatus && <span role="status">{editorStatus}</span>}{editing ? <><button type="button" onClick={() => { setEditing(false); setServices(beforeEdit.current); setEditorCode(""); }}>Cancelar</button><button type="button" onClick={saveRates} disabled={saving}>{saving ? "Guardando…" : "Guardar para todos"}</button></> : <button type="button" onClick={() => setEditorOpen(true)}>Editar valores</button>}</div></div></footer>
  </>;
}
