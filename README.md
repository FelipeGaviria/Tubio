# TuBio

Landing base independiente para crear y vender paginas web responsive.

## Desarrollo local

```powershell
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

## Donde editar

- `content/site.ts`: textos, servicios, botones, WhatsApp, email y SEO.
- `app/globals.css`: colores, layout y estilos visuales.
- `components/`: secciones reutilizables de la landing.

## Deploy en Vercel

1. Sube este proyecto a GitHub.
2. En Vercel, usa `New Project` e importa el repo.
3. Framework: Next.js.
4. Build command: `pnpm build`.
5. Output directory: dejar por defecto.
6. Agrega `NEXT_PUBLIC_SITE_URL` con la URL final cuando la tengas.

## Seguridad base

- No hay base de datos ni backend expuesto.
- No hay secretos en el frontend.
- Los enlaces externos usan `rel="noopener noreferrer"`.
- El sitio incluye metadata, robots y sitemap.