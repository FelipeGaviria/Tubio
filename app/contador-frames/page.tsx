import type { Metadata } from "next";

import { FrameCounter } from "@/components/FrameCounter";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Contador de frames",
  description: "Visor audiovisual local para revisar videos fotograma a fotograma y medir escenas.",
  robots: { index: false, follow: false },
};

export default function FrameCounterPage() {
  return <main className="frame-tool-page">
    <Header />
    <FrameCounter />
  </main>;
}
