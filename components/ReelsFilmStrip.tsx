"use client";

import { useEffect, useRef } from "react";

type Video = { title: string; source: "Instagram" | "YouTube"; href: string; preview: string; embed: boolean };
const videos: Video[] = [
  { title: "Chef Burger", source: "Instagram", href: "https://www.instagram.com/reels/Daf9hcTihB8/", preview: "https://www.instagram.com/reel/Daf9hcTihB8/embed/", embed: true },
  { title: "Odontología San Juan", source: "Instagram", href: "https://www.instagram.com/reels/Da5s7-MBYnF/", preview: "https://www.instagram.com/reel/Da5s7-MBYnF/embed/", embed: true },
  { title: "Burro Pizzería", source: "Instagram", href: "https://www.instagram.com/reels/DX4xAxZu4k4/", preview: "https://www.instagram.com/reel/DX4xAxZu4k4/embed/", embed: true },
  { title: "N. John · Loveless", source: "YouTube", href: "https://www.youtube.com/watch?v=fgrFlp2jMas", preview: "https://i.ytimg.com/vi/fgrFlp2jMas/hqdefault.jpg", embed: false },
  { title: "Pentatonix & Frank Sinatra", source: "YouTube", href: "https://www.youtube.com/watch?v=Muz2n7NYIa0", preview: "https://i.ytimg.com/vi/Muz2n7NYIa0/hqdefault.jpg", embed: false },
  { title: "The Smallest Number", source: "YouTube", href: "https://www.youtube.com/watch?v=3kHXzLcgyTM", preview: "https://i.ytimg.com/vi/3kHXzLcgyTM/hqdefault.jpg", embed: false },
  { title: "Crispetas de Pollo", source: "Instagram", href: "https://www.instagram.com/crispetasdepollo/reel/DVKOOEdAaCr/", preview: "https://www.instagram.com/reel/DVKOOEdAaCr/embed/", embed: true },
  { title: "Carolina Hernández", source: "Instagram", href: "https://www.instagram.com/p/DaiqXzlK5On/", preview: "https://www.instagram.com/p/DaiqXzlK5On/embed/", embed: true },
  { title: "Generadores de empleo", source: "YouTube", href: "https://www.youtube.com/watch?v=IFOuDlqM3xU", preview: "https://i.ytimg.com/vi/IFOuDlqM3xU/hqdefault.jpg", embed: false },
  { title: "Chef Burger News", source: "YouTube", href: "https://www.youtube.com/watch?v=WrXXl1qR6Dc", preview: "https://i.ytimg.com/vi/WrXXl1qR6Dc/hqdefault.jpg", embed: false },
];

export default function ReelsFilmStrip() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = window.setInterval(() => { const element = track.current; if (!element) return; const frame = element.querySelector<HTMLElement>(".raw-film-frame"); const step = ((frame?.offsetWidth ?? 260) + 18) * 2; if (element.scrollLeft + element.clientWidth >= element.scrollWidth - step) element.scrollTo({ left: 0, behavior: "smooth" }); else element.scrollBy({ left: step, behavior: "smooth" }); }, 4400); return () => window.clearInterval(timer); }, []);
  return <section className="raw-reels"><div className="raw-reels-heading"><p className="raw-label">Selección audiovisual</p><h3>Reels y videos.</h3><p>Desde producción, hasta edición y delivery.</p></div><div className="raw-film-viewport" ref={track}><div className="raw-film-track">{videos.map((video, index) => <article className="raw-film-frame" key={video.href}><div className="raw-film-perforations" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="raw-film-image raw-film-preview"><span>{String(index + 1).padStart(2, "0")}</span>{video.embed ? <iframe src={video.preview} title={`Previsualización ${video.title}`} loading="lazy" /> : <img src={video.preview} alt={`Miniatura de ${video.title}`} loading="lazy" />}</div><div className="raw-film-caption"><small>{video.title} · {video.source}</small><a href={video.href} target="_blank" rel="noreferrer" aria-label={`Abrir ${video.title} en ${video.source}`}>▶</a></div><div className="raw-film-perforations" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></article>)}</div></div></section>;
}