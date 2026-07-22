import Link from "next/link";
import { site, whatsappUrl } from "@/content/site";

function PersonIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M5 20c.7-3.7 3-5.5 7-5.5s6.3 1.8 7 5.5" /></svg>; }

export function Header() {
  return <header className="site-header"><Link className="brand" href="/" aria-label={`${site.name} inicio`}><span className="brand-mark">TB</span><span>{site.name}</span></Link><nav aria-label="Navegacion principal">{site.navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><Link className="header-profile-link" href="/portafolio-personal" aria-label="Abrir Portafolio"><PersonIcon /></Link><a className="header-cta" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Contactar</a></div></header>;
}