import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "TuBio",
    short_name: "TuBio",
    description: "TuBio: tus herramientas, proyectos y presencia digital en un solo lugar.",
    lang: "es-CO",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
