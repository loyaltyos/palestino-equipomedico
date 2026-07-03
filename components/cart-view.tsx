"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/products";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <section className="bg-clinical-50 py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-2xl font-semibold text-clinical-900">Tu carrito está vacío</h2>
          <p className="mt-3 text-clinical-700">Agrega productos del catálogo para preparar tu pedido.</p>
          <Link
            href="/catalogo"
            className="mt-6 inline-flex rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white hover:bg-medical-800"
          >
            Ir al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-clinical-50 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="grid gap-4">
          {items.map(({ product, quantity }) => (
            <article key={product.id} className="grid gap-4 rounded-lg border border-clinical-200 bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr_auto]">
              <Image
                src={product.image}
                alt={product.name}
                width={640}
                height={420}
                className="h-32 w-full rounded-md bg-clinical-50 object-cover sm:w-36"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-medical-600">{product.category}</p>
                <h2 className="mt-2 text-lg font-semibold text-clinical-900">{product.name}</h2>
                <p className="mt-2 text-sm text-clinical-700">Precio referencial: {formatCurrency(product.price)}</p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                <div className="inline-flex items-center rounded-md border border-clinical-200 bg-white">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center text-clinical-700 hover:text-medical-700"
                    onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center text-clinical-700 hover:text-medical-700"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                  onClick={() => removeItem(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Quitar
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-clinical-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-clinical-900">Resumen</h2>
          <div className="mt-5 grid gap-3 text-sm text-clinical-700">
            <div className="flex justify-between">
              <span>Subtotal referencial</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-clinical-200 pt-3 text-base font-semibold text-clinical-900">
              <span>Total referencial</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white hover:bg-medical-800"
          >
            Continuar a checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
