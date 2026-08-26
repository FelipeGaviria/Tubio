import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { PrivateUnlock } from "@/components/PrivateUnlock";
import { SocialCalendar } from "@/components/SocialCalendar";
import { SOCIAL_COOKIE, socialAccessToken } from "@/lib/social-access";

export const metadata: Metadata = { title: "Social Calendars", description: "Calendario editorial para organizar marcas, contenidos, estados y notas.", robots: { index: false, follow: false } };

export default async function SocialCalendarsPage() {
  const unlocked = (await cookies()).get(SOCIAL_COOKIE)?.value === socialAccessToken();
  if (!unlocked) return <PrivateUnlock title="Social Calendars" description="Tu calendario editorial, marcas e ideas están protegidos. Ingresa el código para continuar." endpoint="/social-calendars/desbloquear" destination="/social-calendars" />;
  return <main className="social-page tubio-private-page"><Header /><SocialCalendar /></main>;
}
