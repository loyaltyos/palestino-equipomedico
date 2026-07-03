import Link from "next/link";
import { Logo } from "@/components/logo";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/lib/site";

const legalLinks = [["Términos y condiciones", "/terminos-y-condiciones"], ["Aviso de privacidad", "/aviso-de-privacidad"], ["Política de envíos", "/politica-de-envios"], ["Política de devoluciones", "/politica-de-devoluciones"]];

export function Footer() {
  return <footer className="border-t border-clinical-200 bg-clinical-900 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
      <div className="rounded-xl bg-white p-5"><Logo /><p className="mt-4 max-w-md text-sm leading-6 text-clinical-700">Equipamiento médico, mobiliario clínico, diagnóstico e insumos con atención profesional.</p></div>
      <div><h2 className="text-sm font-bold uppercase tracking-[0.16em]">Contacto</h2><div className="mt-4 grid gap-3 text-sm text-clinical-200"><WhatsAppButton label="Contactar por WhatsApp" compact /><span>{siteConfig.email || "Correo por configurar"}</span><span>{siteConfig.address || "Ubicación por configurar"}</span></div></div>
      <div><h2 className="text-sm font-bold uppercase tracking-[0.16em]">Información</h2><div className="mt-4 grid gap-3 text-sm">{legalLinks.map(([label, href]) => <Link key={href} href={href} className="text-clinical-200 hover:text-white">{label}</Link>)}</div></div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-sm text-clinical-200">{siteConfig.footerText}</div>
  </footer>;
}
