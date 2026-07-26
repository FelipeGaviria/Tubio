"use client";

import { useEffect, useRef } from "react";

const videos = [
  { title: "Reel 01", source: "Instagram", href: "https://www.instagram.com/reels/Daf9hcTihB8/" },
  { title: "Reel 02", source: "Instagram", href: "https://www.instagram.com/reels/Da5s7-MBYnF/" },
  { title: "Reel 03", source: "Instagram", href: "https://www.instagram.com/reels/DX4xAxZu4k4/" },
  { title: "Video 04", source: "YouTube", href: "https://www.youtube.com/watch?v=fgrFlp2jMas" },
  { title: "Video 05", source: "YouTube", href: "https://www.youtube.com/watch?v=Muz2n7NYIa0" },
  { title: "Video 06", source: "YouTube", href: "https://www.youtube.com/watch?v=3kHXzLcgyTM" },
  { title: "Reel 07", source: "Instagram", href: "https://www.instagram.com/crispetasdepollo/reel/DVKOOEdAaCr/" },
  { title: "Post 08", source: "Instagram", href: "https://www.instagram.com/p/DaiqXzlK5On/" },
];

export default function ReelsFilmStrip() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = window.setInterval(() => { const element = track.current; if (!element) return; const frame = element.querySelector<HTMLElement>(".raw-film-frame"); const step = ((frame?.offsetWidth ?? 260) + 18) * 2; if (element.scrollLeft + element.clientWidth >= element.scrollWidth - step) element.scrollTo({ left: 0, behavior: "smooth" }); else element.scrollBy({ left: step, behavior: "smooth" }); }, 4400); return () => window.clearInterval(timer); }, []);
  return <section className="raw-reels"><div className="raw-reels-heading"><p className="raw-label">Selección audiovisual</p><h3>Reels y videos.</h3><p>Desde producción, hasta edición y delivery.</p></div><div className="raw-film-viewport"><div className="raw-film-track" ref={track}>{videos.map((video, index) => <a className="raw-film-frame" key={video.href} href={video.href} target="_blank" rel="noreferrer" aria-label={`Abrir ${video.title} en ${video.source}`}><div className="raw-film-perforations" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="raw-film-image"><span>{String(index + 1).padStart(2, "0")}</span><b>VER<br />VIDEO</b></div><div className="raw-film-caption"><small>{video.title} · {video.source}</small><span>▶</span></div><div className="raw-film-perforations" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div></a>)}</div></div></section>;
}