"use client";

import { useEffect, useRef, useState } from "react";

type InstallPrompt = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function FooterInstallButton() {
  const prompt = useRef<InstallPrompt | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const rememberPrompt = (event: Event) => {
      event.preventDefault();
      prompt.current = event as InstallPrompt;
    };
    const installed = () => {
      prompt.current = null;
      dialog.current?.close();
    };
    window.addEventListener("beforeinstallprompt", rememberPrompt);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", rememberPrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const install = async () => {
    const iosNavigator = navigator as Navigator & { standalone?: boolean };
    if (window.matchMedia("(display-mode: standalone)").matches || iosNavigator.standalone) {
      setMessage("Ya estás usando TuBio como app.");
      dialog.current?.showModal();
      return;
    }
    if (prompt.current) {
      const pending = prompt.current;
      prompt.current = null;
      try {
        await pending.prompt();
        await pending.userChoice;
        return;
      } catch {
        // El navegador puede invalidar el permiso; ofrecer la instalación manual.
      }
    }
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setMessage(isIOS
      ? "Abre TuBio en Safari, toca Compartir y elige Agregar a pantalla de inicio. Si aparece Abrir como app, déjalo activado y toca Agregar."
      : "Abre el menú de tu navegador y busca Instalar app o Agregar a pantalla de inicio. Si no aparece, abre este sitio en Chrome o Edge y vuelve a intentarlo. La opción depende de tu navegador.");
    dialog.current?.showModal();
  };

  return <>
    <button className="footer-share footer-install" type="button" onClick={install} aria-label="Instalar TuBio como app" title="Instalar TuBio">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" /></svg>
    </button>
    <dialog ref={dialog} className="install-dialog" aria-labelledby="install-title" aria-describedby="install-description" onClick={(event) => {
      if (event.target === event.currentTarget) {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }
    }}>
      <h2 id="install-title">TuBio en tu celular</h2>
      <p id="install-description">{message}</p>
      <form method="dialog"><button className="button button-primary" type="submit">Entendido</button></form>
    </dialog>
  </>;
}
