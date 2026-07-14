"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FormEvent, useCallback, useRef, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/products";

declare global {
  interface Window {
    ConektaCheckoutComponents?: {
      Card: (options: Record<string, unknown>) => void;
    };
  }
}

type PaymentResponse = { status: "paid" | "pending" | "failed"; orderId: string; total: number; currency: string; items: Array<{ id: string; name: string; unitPrice: number; quantity: number }>; error?: string };
const genericError = "No fue posible procesar el pago. Revisa tus datos o utiliza otra tarjeta.";

export function CheckoutView() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const processingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [tokenizerReady, setTokenizerReady] = useState(false);
  const [error, setError] = useState("");
  const publicKey = process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY;

  const processToken = useCallback(async (token: unknown) => {
    if (processingRef.current) return;
    const form = formRef.current;
    if (!form || !form.reportValidity()) { setError("Completa tus datos de contacto y dirección."); return; }
    const tokenId = token && typeof token === "object" && "id" in token && typeof token.id === "string" ? token.id : "";
    if (!tokenId) { setError(genericError); return; }
    processingRef.current = true; setLoading(true); setError("");
    const values = new FormData(form);
    try {
      const response = await fetch("/api/conekta/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId,
          items: items.map(({ product, quantity }) => ({ id: product.id, quantity })),
          customer: {
            name: values.get("name"), email: values.get("email"), phone: values.get("phone"),
            address: { street: values.get("street"), city: values.get("city"), state: values.get("state"), postalCode: values.get("postalCode") },
          },
        }),
      });
      const result = await response.json() as PaymentResponse;
      if (!response.ok || result.status === "failed") throw new Error("payment_failed");
      sessionStorage.setItem("palestina-payment-result", JSON.stringify(result));
      if (result.status === "paid") { clearCart(); router.replace("/pago-exitoso"); }
      else router.replace("/pago-pendiente");
    } catch { sessionStorage.removeItem("palestina-payment-result"); setError(genericError); setLoading(false); processingRef.current = false; }
  }, [clearCart, items, router]);

  const initializeTokenizer = useCallback(() => {
    if (!publicKey || !window.ConektaCheckoutComponents || tokenizerReady) return;
    window.ConektaCheckoutComponents.Card({
      config: { targetIFrame: "#conektaIframeContainer", publicKey, locale: "es" },
      callbacks: {
        onCreateTokenSucceeded: processToken,
        onCreateTokenError: () => setError(genericError),
        onGetInfoSuccess: () => setTokenizerReady(true),
      },
      options: { backgroundMode: "lightMode", colorPrimary: "#146c75", colorText: "#334155", colorLabel: "#334155", hideLogo: false, inputType: "minimalMode", excludeCardNetworks: [] },
    });
  }, [processToken, publicKey, tokenizerReady]);

  if (!items.length) return <section className="bg-clinical-50 py-16"><div className="mx-auto max-w-3xl px-5 text-center"><h2 className="text-2xl font-semibold text-clinical-900">No hay productos para finalizar</h2><p className="mt-3 text-clinical-700">Agrega productos al carrito antes de continuar.</p><Link href="/catalogo" className="mt-6 inline-flex rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white">Ver catálogo</Link></div></section>;

  return (
    <section className="bg-clinical-50 py-12">
      <Script src="https://pay.conekta.com/v1.0/js/conekta-checkout.min.js" strategy="afterInteractive" onLoad={initializeTokenizer} />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="grid gap-6">
          <form ref={formRef} onSubmit={(event: FormEvent) => event.preventDefault()} className="rounded-lg border border-clinical-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-clinical-900">Datos de contacto y entrega</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" name="name" autoComplete="name" minLength={2} />
              <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" pattern="[+0-9 ()-]{10,20}" />
              <Field label="Correo" name="email" type="email" autoComplete="email" className="sm:col-span-2" />
              <Field label="Calle, número exterior e interior" name="street" autoComplete="street-address" minLength={5} className="sm:col-span-2" />
              <Field label="Ciudad o municipio" name="city" autoComplete="address-level2" minLength={2} />
              <Field label="Estado" name="state" autoComplete="address-level1" minLength={2} />
              <Field label="Código postal" name="postalCode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} />
            </div>
          </form>
          <div className="relative rounded-lg border border-clinical-200 bg-white p-6 shadow-sm" aria-busy={loading}>
            <h2 className="text-2xl font-semibold text-clinical-900">Pago con tarjeta</h2>
            <p className="mt-2 text-sm text-clinical-700">Tus datos de tarjeta son capturados de forma segura por Conekta.</p>
            {!publicKey ? <p className="mt-5 rounded-md bg-amber-50 p-4 text-sm text-amber-900">El pago no está disponible temporalmente.</p> : <div id="conektaIframeContainer" className="mt-5 min-h-[360px]" />}
            {loading ? <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90"><p className="font-semibold text-medical-700">Procesando pago…</p></div> : null}
            {error ? <p role="alert" className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
          </div>
        </div>
        <aside className="h-fit rounded-lg border border-clinical-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-md bg-medical-50 text-medical-700"><LockKeyhole className="h-5 w-5" /></span><div><h2 className="text-xl font-semibold text-clinical-900">Resumen del pedido</h2><p className="text-sm text-clinical-700">Pago seguro en MXN</p></div></div>
          <div className="mt-6 grid gap-4">{items.map(({ product, quantity }) => <div key={product.id} className="flex gap-3 border-b border-clinical-200 pb-4"><Image src={product.image} alt={product.name} width={96} height={96} className="h-16 w-16 rounded-md object-cover" /><div><p className="text-sm font-semibold text-clinical-900">{product.name}</p><p className="text-sm text-clinical-700">{quantity} × {formatCurrency(product.price)}</p></div></div>)}</div>
          <div className="mt-5 flex justify-between text-lg font-semibold text-clinical-900"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
        </aside>
      </div>
    </section>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string };
function Field({ label, className = "", ...props }: FieldProps) {
  return <label className={`grid gap-2 text-sm font-semibold text-clinical-900 ${className}`}><span>{label}</span><input {...props} required className="rounded-md border border-clinical-200 px-4 py-3 font-normal outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100" /></label>;
}
