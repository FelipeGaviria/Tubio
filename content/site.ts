export const site = {
  name: "TuBio",
  tagline: "Landings claras para negocios que quieren vender mejor.",
  description:
    "Creamos paginas responsive, rapidas y editables para marcas personales, servicios locales y emprendimientos que necesitan presencia profesional.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contact: {
    whatsapp: "573000000000",
    email: "hola@tubio.co",
    city: "Colombia",
  },
  navigation: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Proceso", href: "/#proceso" },
    { label: "Ruleta", href: "/#ruleta" },
    { label: "Portafolio", href: "/portafolio" },
    { label: "FAQ", href: "/#faq" },
  ],
  hero: {
    eyebrow: "Tu taller para vender paginas web",
    title: "Paginas web responsive, seguras y listas para publicar en Vercel.",
    body:
      "TuBio es una base independiente para crear landings de clientes, iterarlas con criterio y convertirlas en proyectos reales sin mezclar nada con RiBuzz.",
    primaryAction: "Quiero mi landing",
    secondaryAction: "Ver estructura",
  },
  metrics: [
    { value: "1", label: "archivo para editar contenido" },
    { value: "0", label: "dependencias innecesarias" },
    { value: "100%", label: "responsive desde el inicio" },
  ],
  services: [
    {
      title: "Landing de venta",
      description:
        "Una pagina enfocada en explicar una oferta, responder dudas y llevar al visitante a WhatsApp o formulario.",
    },
    {
      title: "Web profesional",
      description:
        "Estructura para marcas personales, negocios locales, restaurantes, hoteles, inmobiliarias o servicios profesionales.",
    },
    {
      title: "Sistema editable",
      description:
        "Contenido organizado para cambiar textos, secciones y llamadas a la accion sin rehacer todo el proyecto.",
    },
  ],
  process: [
    "Brief del cliente, objetivo y publico.",
    "Arquitectura de secciones y mensajes clave.",
    "Diseno responsive y desarrollo en Next.js.",
    "Revision, ajustes, GitHub y deploy en Vercel.",
  ],
  landingWheel: [
    {
      title: "Restaurante local",
      status: "Menu + reservas",
      kind: "food",
      href: "#contacto",
    },
    {
      title: "Marca personal",
      status: "Perfil + agenda",
      kind: "profile",
      href: "#contacto",
    },
    {
      title: "Hotel boutique",
      status: "Habitaciones + WhatsApp",
      kind: "hotel",
      href: "#contacto",
    },
    {
      title: "Servicio profesional",
      status: "Confianza + leads",
      kind: "service",
      href: "#contacto",
    },
    {
      title: "Catalogo simple",
      status: "Productos + contacto",
      kind: "catalog",
      href: "#contacto",
    },
    {
      title: "Evento o lanzamiento",
      status: "Fecha + registro",
      kind: "event",
      href: "#contacto",
    },
  ],
  faqs: [
    {
      question: "Esto esta conectado a RiBuzz?",
      answer:
        "No. TuBio es un proyecto independiente, con su propio codigo, contenido y configuracion.",
    },
    {
      question: "Necesita base de datos para funcionar?",
      answer:
        "No para una landing inicial. Puede operar con WhatsApp, email y contenido estatico. Si un cliente necesita login, pagos o panel, se agrega despues con alcance aparte.",
    },
    {
      question: "Es seguro para publicar?",
      answer:
        "La base es segura para un sitio informativo: no expone secretos, no ejecuta HTML externo y no tiene endpoints publicos innecesarios.",
    },
  ],
};

export function whatsappUrl(message = "Hola, quiero una landing web") {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${site.contact.whatsapp}?text=${encoded}`;
}