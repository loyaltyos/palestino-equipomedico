"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatCurrency, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-clinical-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative overflow-hidden bg-clinical-50 p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={640}
          height={420}
          className="h-52 w-full rounded-xl object-contain transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-medical-600">
          {product.category}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-clinical-900">{product.name}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-clinical-700">{product.description}</p>
        <p className="mt-4 text-xs font-medium text-clinical-500">Precio referencial</p>
        <p className="text-2xl font-semibold text-clinical-900">{formatCurrency(product.price)}</p>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={() => addItem(product)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-medical-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-medical-800"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </button>
          <WhatsAppButton
            label="Cotizar por WhatsApp"
            message={`Hola, me interesa cotizar: ${product.name}.`}
          />
        </div>
      </div>
    </article>
  );
}
