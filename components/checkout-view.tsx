"use client";

import Link from "next/link";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/products";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const conektaConfigured = Boolean(process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY);

export function CheckoutView() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="bg-clinical-50 py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-2xl font-semibold text-clinical-900">No hay productos para finalizar</h2>
          <p className="mt-3 text-clinical-700">Agrega productos al carrito antes de continuar.</p>
          <Link
            href="/catalogo"
            className="mt-6 inline-flex rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white hover:bg-medical-800"
          >
            Ver catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-clinical-50 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <form className="rounded-lg border border-clinical-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-clinical-900">Datos de contacto</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["Nombre", "text", "nombre"],
              ["Teléfono", "tel", "telefono"],
              ["Correo", "email", "correo"]
            ].map(([label, type, name]) => (
              <label key={name} className="grid gap-2 text-sm font-semibold text-clinical-900">
                <span className="inline-flex items-center gap-2">{name === "telefono" ? <WhatsAppIcon className="h-4 w-4 text-[#128c4a]" /> : null}{label}</span>
                <input
                  name={name}
                  type={type}
                  className="rounded-md border border-clinical-200 px-4 py-3 font-normal outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                  required
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm font-semibold text-clinical-900 sm:col-span-2">
              Dirección
              <textarea
                name="direccion"
                rows={3}
                className="rounded-md border border-clinical-200 px-4 py-3 font-normal outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-clinical-900 sm:col-span-2">
              Comentarios
              <textarea
                name="comentarios"
                rows={4}
                className="rounded-md border border-clinical-200 px-4 py-3 font-normal outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100"
              />
            </label>
          </div>
          <div className="mt-6 rounded-lg border border-medical-100 bg-medical-50 p-4 text-sm leading-6 text-clinical-700">
            <div className="flex gap-3">
              <WhatsAppIcon className="mt-0.5 h-5 w-5 flex-none text-[#128c4a]" />
              <p>
                Pago pendiente de integración. Un asesor se comunicará contigo para finalizar tu compra.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-6 inline-flex w-full justify-center rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white hover:bg-medical-800"
          >
            Enviar solicitud de compra
          </button>
        </form>
        <aside className="h-fit rounded-lg border border-clinical-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-medical-50 text-medical-700">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-clinical-900">Resumen del pedido</h2>
              <p className="text-sm text-clinical-700">
                {conektaConfigured ? "Conekta listo para activación." : "Integración Conekta preparada."}
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 border-b border-clinical-200 pb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="h-16 w-16 rounded-md bg-clinical-50 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-clinical-900">{product.name}</p>
                  <p className="text-sm text-clinical-700">
                    {quantity} x {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between text-lg font-semibold text-clinical-900">
            <span>Total referencial</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
