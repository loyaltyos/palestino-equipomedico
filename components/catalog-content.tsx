"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export function CatalogContent() {
  const params = useSearchParams();
  const activeCategory = params.get("categoria") ?? "Todos";
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase("es-MX");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const searchable = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("es-MX");
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [activeCategory, query]);

  return (
    <section className="bg-clinical-50 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {["Todos", ...categories].map((category) => (
            <a
              key={category}
              href={category === "Todos" ? "/catalogo" : `/catalogo?categoria=${encodeURIComponent(category)}`}
              className={`whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? "border-medical-700 bg-medical-700 text-white"
                  : "border-clinical-200 bg-white text-clinical-700 hover:border-medical-200"
              }`}
            >
              {category}
            </a>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 ? <div className="mt-8 rounded-2xl border border-clinical-200 bg-white p-10 text-center"><h2 className="text-xl font-bold text-clinical-900">No encontramos ese producto</h2><p className="mt-2 text-clinical-700">Prueba otra búsqueda o explora las categorías.</p></div> : null}
      </div>
    </section>
  );
}
