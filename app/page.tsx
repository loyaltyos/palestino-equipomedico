import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { categories, products } from "@/lib/products";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const categoryImages: Record<string, string> = {
  "Camas hospitalarias": "/products/photos/cama-hospitalaria.webp",
  "Movilidad y apoyo": "/products/photos/silla-ruedas.webp",
  Oxigenoterapia: "/products/photos/concentrador.webp",
  Diagnóstico: "/products/photos/tensiometro.webp",
  "Mobiliario médico": "/products/photos/mesa-exploracion.webp",
  "Exploración clínica": "/products/photos/lampara.webp",
  Rehabilitación: "/products/photos/rehabilitacion.webp",
  "Insumos médicos": "/products/photos/insumos.webp"
};

export default function HomePage() {
  return (
    <>
      <section className="bg-medical-800 text-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {[
            [Truck, "Envíos a todo México"],
            [BadgeCheck, "Equipos de calidad certificada"],
            [WhatsAppIcon, "Asesoría profesional personalizada"]
          ].map(([Icon, text]) => {
            const BenefitIcon = Icon as typeof Truck;
            return <div key={String(text)} className="flex items-center justify-center gap-2 py-3 text-center text-xs font-semibold sm:text-sm"><BenefitIcon className="h-4 w-4" />{String(text)}</div>;
          })}
        </div>
      </section>

      <section className="relative min-h-[650px] overflow-hidden bg-clinical-900">
        <Image src="/products/photos/hero.jpg" alt="Consultorio equipado con mobiliario médico" fill priority className="object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-clinical-950 via-clinical-900/85 to-clinical-900/15" />
        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur"><ShieldCheck className="h-4 w-4" />Soluciones médicas para cada etapa del cuidado</p>
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Equipamiento médico confiable para hospitales, clínicas y hogares</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-clinical-100">Productos hospitalarios, diagnóstico e insumos seleccionados con atención profesional y entrega en todo México.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 rounded-lg bg-medical-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-medical-500">Ver catálogo <ArrowRight className="h-4 w-4" /></Link>
              <WhatsAppButton label="Cotizar por WhatsApp" dark />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-clinical-50 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4"><div><p className="section-kicker">Encuentra lo que necesitas</p><h2 className="section-title">Categorías destacadas</h2></div><Link href="/catalogo" className="hidden items-center gap-2 text-sm font-bold text-medical-700 sm:flex">Ver todas <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => <Link key={category} href={`/catalogo?categoria=${encodeURIComponent(category)}`} className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft"><div className="relative h-48 overflow-hidden bg-white"><Image src={categoryImages[category]} alt={category} fill className="object-contain p-4 transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 25vw" /><div className="absolute inset-0 bg-gradient-to-t from-clinical-950/80 via-transparent to-transparent" /><h3 className="absolute bottom-0 p-5 text-lg font-bold text-white">{category}</h3></div></Link>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4"><div><p className="section-kicker">Selección Palestina</p><h2 className="section-title">Productos destacados</h2></div><Link href="/catalogo" className="hidden items-center gap-2 text-sm font-bold text-medical-700 sm:flex">Ver catálogo <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>
    </>
  );
}
