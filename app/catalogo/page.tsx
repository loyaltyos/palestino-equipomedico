import { Suspense } from "react";
import { CatalogContent } from "@/components/catalog-content";
import { PageHero } from "@/components/page-hero";

export default function CatalogPage() {
  return (
    <>
      <PageHero
        title="Catálogo médico"
        description="Precios referenciales en MXN para equipos médicos, mobiliario hospitalario, diagnóstico e insumos. Solicita asesoría para confirmar disponibilidad, especificaciones y entrega."
      />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-12">Cargando catálogo...</div>}>
        <CatalogContent />
      </Suspense>
    </>
  );
}
