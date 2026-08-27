"use client";

import Link from "next/link";

const profile = {
  name: "Sofía Andrade",
  role: "Directora creativa",
  company: "Estudio Nómada",
  phone: "+57 300 000 0000",
  email: "hola@estudionomada.co",
  website: "estudionomada.co",
};

const contactItems = [
  { label: "Llamar", value: profile.phone, href: `tel:${profile.phone.replaceAll(" ", "")}`, icon: "↗" },
  { label: "Escribir", value: profile.email, href: `mailto:${profile.email}`, icon: "@" },
  { label: "Visitar", value: profile.website, href: "https://estudionomada.co", icon: "◌" },
  { label: "Instagram", value: "@estudionomada", href: "https://instagram.com", icon: "◎" },
];

function buildVCard() {
  return ["BEGIN:VCARD", "VERSION:3.0", `FN:${profile.name}`, `TITLE:${profile.role}`, `ORG:${profile.company}`, `TEL;TYPE=CELL:${profile.phone}`, `EMAIL;TYPE=INTERNET:${profile.email}`, `URL:https://${profile.website}`, "END:VCARD"].join("\n");
}

export default function TemplateTwoClient() {
  const handleAddContact = () => {
    const objectUrl = URL.createObjectURL(new Blob([buildVCard()], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "sofia-andrade.vcf";
    link.click();
    URL.revokeObjectURL(objectUrl);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: profile.name, text: `${profile.name} · ${profile.role}`, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <main className="template-two-shell">
      <div className="template-two-orbit template-two-orbit-one" aria-hidden="true" />
      <div className="template-two-orbit template-two-orbit-two" aria-hidden="true" />
      <section className="template-two-stage">
        <Link className="template-two-back" href="/">Volver al portafolio</Link>
        <article className="template-two-card">
          <div className="template-two-photo" role="img" aria-label="Retrato abstracto de Sofía Andrade"><span>SA</span><i>creative direction / 2026</i></div>
          <div className="template-two-content">
            <p className="template-two-kicker">TuBio / digital card 02</p>
            <h1>{profile.name}</h1>
            <p className="template-two-role">{profile.role} <span>·</span> {profile.company}</p>
            <p className="template-two-intro">Ideas con dirección, marcas con carácter y experiencias que se quedan en la memoria.</p>
            <div className="template-two-contacts">
              {contactItems.map((item) => <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}><strong>{item.icon}</strong><span><small>{item.label}</small>{item.value}</span><b>→</b></a>)}
            </div>
            <div className="template-two-actions"><button type="button" onClick={handleAddContact}>＋ Guardar contacto</button><button type="button" className="template-two-share" onClick={handleShare}>Compartir ↗</button></div>
            <footer className="template-two-footer"><span>Estudio Nómada</span><Link href="/">Hecho con TuBio</Link></footer>
          </div>
        </article>
      </section>
    </main>
  );
}
