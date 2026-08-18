import type { Metadata } from "next";
import { cookies } from "next/headers";

import { CourseOrderTracker } from "@/components/CourseOrderTracker";
import { Header } from "@/components/Header";
import { OrderUnlock } from "@/components/OrderUnlock";
import courseModules from "@/content/course-order.json";
import { accessToken, ORDER_COOKIE } from "@/lib/order-access";

export const metadata: Metadata = {
  title: "Orden del curso",
  description: "Mapa personal del curso y seguimiento de lecciones.",
  robots: { index: false, follow: false },
};

export default async function OrderPage() {
  const unlocked = (await cookies()).get(ORDER_COOKIE)?.value === accessToken();
  return (
    <main className="order-page">
      <Header />
      <section className="order-hero">
        <div className="container">
          <p className="eyebrow">Tu ruta de estudio</p>
          <h1>Orden</h1>
          <p className="order-lead">
            Tu espacio privado para organizar módulos, marcar avances y ajustar el orden de cada lección.
          </p>
          <p className="order-local-note">El progreso se guarda sólo en este navegador.</p>
        </div>
      </section>
      <section className="container order-content">
        {unlocked ? <CourseOrderTracker initialModules={courseModules} /> : <OrderUnlock />}
      </section>
    </main>
  );
}
