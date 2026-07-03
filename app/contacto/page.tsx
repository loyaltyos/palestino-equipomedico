import { Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  return <>
    <PageHero title="Contacto" description="Recibe atención personalizada para cotizaciones, disponibilidad, entregas y selección de equipo médico." />
    <section className="bg-clinical-50 py-12"><div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="grid gap-4">
        <ContactCard icon={<WhatsAppIcon className="h-6 w-6" />} title="WhatsApp" text={siteConfig.whatsappNumber || "Número por configurar"} />
        <ContactCard icon={<WhatsAppIcon className="h-6 w-6" />} title="Atención personalizada" text="Asesoría directa para elegir el equipo adecuado" />
        <ContactCard icon={<Mail className="h-6 w-6" />} title="Correo" text={siteConfig.email || "Correo por configurar"} />
        <ContactCard icon={<MapPin className="h-6 w-6" />} title="Ubicación" text={siteConfig.address || "Ubicación por configurar"} />
        <WhatsAppButton label="Iniciar conversación por WhatsApp" />
      </div>
      <form className="rounded-xl border border-clinical-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-semibold text-clinical-900">Formulario de contacto</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Nombre"><input className="form-field" /></Field>
        <Field label="WhatsApp o teléfono" icon><input type="tel" className="form-field" /></Field>
        <Field label="Correo" wide><input type="email" className="form-field" /></Field>
        <Field label="Mensaje" wide><textarea rows={6} className="form-field" /></Field>
      </div><button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#128c4a] px-6 py-3 text-sm font-bold text-white hover:bg-[#0f783f]"><WhatsAppIcon className="h-5 w-5" />Contáctanos por WhatsApp</button></form>
    </div></section>
  </>;
}

function ContactCard({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <div className="rounded-xl border border-clinical-200 bg-white p-6 text-medical-600 shadow-sm"><div className="flex items-center gap-3">{icon}<h2 className="font-semibold text-clinical-900">{title}</h2></div><p className="mt-2 text-sm text-clinical-700">{text}</p></div> }
function Field({label,icon,wide,children}:{label:string;icon?:boolean;wide?:boolean;children:React.ReactNode}) { return <label className={`grid gap-2 text-sm font-semibold text-clinical-900 ${wide ? "sm:col-span-2" : ""}`}><span className="inline-flex items-center gap-2">{icon ? <WhatsAppIcon className="h-4 w-4 text-[#128c4a]" /> : null}{label}</span>{children}</label> }
