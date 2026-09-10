"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

type InstallPrompt = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type PendingPrompt = { event: InstallPrompt; manifest: string | undefined };
const InstallContext = createContext<{ current: PendingPrompt | null } | null>(null);

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const pending = useRef<PendingPrompt | null>(null);
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      pending.current = { event: event as InstallPrompt, manifest: document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href };
    };
    const clear = () => { pending.current = null; };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", clear);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", clear);
    };
  }, []);
  return <InstallContext.Provider value={pending}>{children}</InstallContext.Provider>;
}

export function useInstallPrompt() { return useContext(InstallContext); }
