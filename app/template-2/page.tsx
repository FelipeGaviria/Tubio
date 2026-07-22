import { createPageMetadata } from "@/lib/metadata";
import TemplateTwoClient from "./template-two-client";

export const metadata = createPageMetadata({
  title: "Template 2",
  description: "Template bio digital de TuBio con contactos, enlaces y acciones rápidas.",
  path: "/template-2",
});

export default function TemplateTwoPage() {
  return <TemplateTwoClient />;
}
