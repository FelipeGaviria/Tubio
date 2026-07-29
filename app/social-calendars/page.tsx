import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SocialCalendar } from "@/components/SocialCalendar";

export const metadata: Metadata = {
  title: "Social Calendars",
  description: "Calendario editorial para organizar marcas, contenidos, estados y notas.",
};

export default function SocialCalendarsPage() {
  return <main className="social-page"><Header /><SocialCalendar /></main>;
}