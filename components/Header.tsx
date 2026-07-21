import { site, whatsappUrl } from "@/content/site";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label={`${site.name} inicio`}>
        <span className="brand-mark">TB</span>
        <span>{site.name}</span>
      </a>
      <nav aria-label="Navegacion principal">
        {site.navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
        Contactar
      </a>
    </header>
  );
}