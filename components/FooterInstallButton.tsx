"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInstallPrompt } from "@/components/InstallPromptProvider";

export function FooterInstallButton({ appName = "TuBio", className = "footer-share footer-install" }: { appName?: string; className?: string }) {
  const titleId = useId();
  const descriptionId = useId();
  const promptRef = useInstallPrompt();
  const dialog = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const installed = () => {
      dialog.current?.close();
    };
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const install = async () => {
    const iosNavigator = navigator as Navigator & { standalone?: boolean };
    if (window.matchMedia("(display-mode: standalone)").matches || iosNavigator.standalone) {
      setMessage(`Ya estás usando ${appName} en una ventana de app. Para instalarla por separado, abre esta misma dirección en Chrome o Safari.`);
      dialog.current?.showModal();
      return;
    }
    const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href;
    if (promptRef?.current && promptRef.current.manifest === manifest) {
      const pending = promptRef.current.event;
      promptRef.current = null;
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
      ? `En Chrome o Safari, toca Compartir, elige Agregar a pantalla de inicio y confirma con Agregar. Si aparece Abrir como app, déjalo activado. Si estás dentro de otra app y no ves esta opción, abre ${appName} en Chrome o Safari.`
      : "Abre el menú de tu navegador y busca Instalar app o Agregar a pantalla de inicio. Si no aparece, abre este sitio en Chrome o Edge y vuelve a intentarlo. La opción depende de tu navegador.");
    dialog.current?.showModal();
  };

  return <>
    <button className={className} type="button" onClick={install} aria-label={`Instalar ${appName} como app`} title={`Instalar ${appName}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" /></svg>
    </button>
    <dialog ref={dialog} className="install-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={(event) => {
      if (event.target === event.currentTarget) {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }
    }}>
      <h2 id={titleId}>{appName} en tu celular</h2>
      <p id={descriptionId}>{message}</p>
      <form method="dialog"><button className="button button-primary" type="submit">Entendido</button></form>
    </dialog>
  </>;
}
