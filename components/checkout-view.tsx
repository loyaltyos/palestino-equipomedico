"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/products";

type ConektaCallbacks = {
  onGetInfoSuccess: (info: unknown) => void;
  onFinalizePayment: (order: unknown) => void;
  onErrorPayment: (error: unknown) => void;
  onCreateTokenSucceeded: (token: unknown) => void;
  onCreateTokenError: (error: unknown) => void;
};

declare global {
  interface Window {
    ConektaCheckoutComponents?: {
      Integration: (options: { config: Record<string, unknown>; callbacks: ConektaCallbacks; options: Record<string, unknown> }) => unknown;
    };
  }
}

type CheckoutResponse = { checkoutRequestId?: string; orderId?: string; status?: string; total?: number; currency?: string; error?: string };
type PaymentState = "idle" | "creating" | "initializing" | "ready" | "processing" | "error";
const loadError = "No fue posible cargar el formulario de pago. Intenta nuevamente.";

function safeClientLog(event: string, details?: Record<string, string | number | boolean>) {
  console.info(event, details ?? {});
}

export function CheckoutView() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const initializedCheckoutRef = useRef("");
  const mountedRef = useRef(true);
  const orderIdRef = useRef("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [error, setError] = useState("");
  const publicKey = process.env.NEXT_PUBLIC_CONEKTA_PUBLIC_KEY ?? "";

  const clearComponent = useCallback(() => {
    const container = document.getElementById("conekta-checkout");
    if (container) container.replaceChildren();
    initializedCheckoutRef.current = "";
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    safeClientLog("public_key_present", { present: Boolean(publicKey), valid_prefix: publicKey.startsWith("key_") });
    safeClientLog("user_agent", { value: navigator.userAgent.slice(0, 180) });
    safeClientLog("viewport_width", { value: window.innerWidth });
    return () => { mountedRef.current = false; clearComponent(); };
  }, [clearComponent, publicKey]);

  const finishPayment = useCallback((order: unknown) => {
    safeClientLog("component_finalize_payment", { received: Boolean(order) });
    setPaymentState("processing");
    sessionStorage.setItem("palestina-payment-result", JSON.stringify({
      status: "paid",
      orderId: orderIdRef.current,
      total: Math.round(subtotal * 100),
      currency: "MXN",
      items: items.map(({ product, quantity }) => ({ id: product.id, name: product.name, unitPrice: Math.round(product.price * 100), quantity })),
    }));
    clearCart();
    router.replace("/pago-exitoso");
  }, [clearCart, items, router, subtotal]);

  useEffect(() => {
    if (!scriptLoaded || !checkoutRequestId || !publicKey || paymentState !== "initializing") return;
    if (initializedCheckoutRef.current === checkoutRequestId) return;
    const container = document.getElementById("conekta-checkout");
    const integration = window.ConektaCheckoutComponents?.Integration;
    if (!container || !integration) {
      safeClientLog("component_error", { reason: !container ? "container_missing" : "api_missing" });
      queueMicrotask(() => {
        if (!mountedRef.current) return;
        setError(loadError);
        setPaymentState("error");
      });
      return;
    }
    initializedCheckoutRef.current = checkoutRequestId;
    safeClientLog("component_init_started");
    try {
      integration({
        config: { locale: "es", publicKey, targetIFrame: "#conekta-checkout", checkoutRequestId },
        options: { backgroundMode: "lightMode", colorPrimary: "#08679f", inputType: "minimalMode", autoResize: true },
        callbacks: {
          onGetInfoSuccess: () => {
            if (!mountedRef.current) return;
            safeClientLog("component_info_success"); setError(""); setPaymentState("ready");
          },
          onFinalizePayment: finishPayment,
          onErrorPayment: () => {
            safeClientLog("component_error", { reason: "payment" });
            setError("No fue posible procesar el pago. Revisa tus datos o utiliza otra tarjeta."); setPaymentState("ready");
          },
          onCreateTokenSucceeded: () => safeClientLog("component_token_created"),
          onCreateTokenError: () => {
            safeClientLog("component_error", { reason: "token" });
            setError("No fue posible procesar los datos de la tarjeta. Revisa la información.");
          },
        },
      });
    } catch {
      initializedCheckoutRef.current = "";
      safeClientLog("component_error", { reason: "initialization_exception" });
      queueMicrotask(() => {
        if (!mountedRef.current) return;
        setError(loadError);
        setPaymentState("error");
      });
    }
  }, [checkoutRequestId, finishPayment, paymentState, publicKey, scriptLoaded]);

  const createCheckout = useCallback(async () => {
    const form = formRef.current;
    if (!form || !form.reportValidity()) { setError("Completa tus datos de contacto y dirección."); return; }
    if (!publicKey || !publicKey.startsWith("key_")) { setError("El pago no está disponible temporalmente."); setPaymentState("error"); return; }
    clearComponent(); setCheckoutRequestId(""); setError(""); setPaymentState("creating");
    safeClientLog("checkout_request_started");
    const values = new FormData(form);
    try {
      const response = await fetch("/api/conekta/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product, quantity }) => ({ id: product.id, quantity })),
          customer: {
            name: values.get("name"), email: values.get("email"), phone: values.get("phone"),
            address: { street: values.get("street"), city: values.get("city"), state: values.get("state"), postalCode: values.get("postalCode") },
          },
        }),
      });
      const result = (await response.json()) as CheckoutResponse;
      safeClientLog("checkout_request_status", { ok: response.ok, status: response.status });
      const requestId = typeof result.checkoutRequestId === "string" ? result.checkoutRequestId : "";
      safeClientLog("checkout_request_id_present", { present: Boolean(requestId) });
      if (!response.ok || !requestId) throw new Error("checkout_creation_failed");
      orderIdRef.current = typeof result.orderId === "string" ? result.orderId : "";
      setCheckoutRequestId(requestId); setPaymentState("initializing");
    } catch { setError(loadError); setPaymentState("error"); }
  }, [clearComponent, items, publicKey]);

  const onSubmit = (event: FormEvent) => { event.preventDefault(); void createCheckout(); };

  if (!items.length) return <section className="bg-clinical-50 py-16"><div className="mx-auto max-w-3xl px-5 text-center"><h2 className="text-2xl font-semibold text-clinical-900">No hay productos para finalizar</h2><p className="mt-3 text-clinical-700">Agrega productos al carrito antes de continuar.</p><Link href="/catalogo" className="mt-6 inline-flex rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white">Ver catálogo</Link></div></section>;

  const loadingComponent = paymentState === "creating" || paymentState === "initializing";
  return (
    <section className="checkout-page bg-clinical-50 py-12">
      <Script id="conekta-checkout-script" src="https://pay.conekta.com/v1.0/js/conekta-checkout.min.js" strategy="afterInteractive"
        onLoad={() => { safeClientLog("conekta_script_loaded"); setScriptLoaded(true); }}
        onReady={() => setScriptLoaded(Boolean(window.ConektaCheckoutComponents?.Integration))}
        onError={() => { safeClientLog("component_error", { reason: "script_load" }); setError(loadError); setPaymentState("error"); }} />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="grid gap-6">
          <form ref={formRef} onSubmit={onSubmit} className="rounded-lg border border-clinical-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-clinical-900">Datos de contacto y entrega</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" name="name" autoComplete="name" minLength={2} disabled={paymentState === "ready"} />
              <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" pattern="[+0-9 ()-]{10,20}" disabled={paymentState === "ready"} />
              <Field label="Correo" name="email" type="email" autoComplete="email" className="sm:col-span-2" disabled={paymentState === "ready"} />
              <Field label="Calle, número exterior e interior" name="street" autoComplete="street-address" minLength={5} className="sm:col-span-2" disabled={paymentState === "ready"} />
              <Field label="Ciudad o municipio" name="city" autoComplete="address-level2" minLength={2} disabled={paymentState === "ready"} />
              <Field label="Estado" name="state" autoComplete="address-level1" minLength={2} disabled={paymentState === "ready"} />
              <Field label="Código postal" name="postalCode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} disabled={paymentState === "ready"} />
            </div>
            {paymentState !== "ready" && paymentState !== "processing" ? <button type="submit" disabled={loadingComponent} className="mt-6 w-full rounded-md bg-medical-700 px-6 py-3 font-semibold text-white transition hover:bg-medical-800 disabled:cursor-wait disabled:opacity-60">{loadingComponent ? "Preparando pago…" : "Continuar al pago"}</button> : null}
          </form>
          <div className="relative rounded-lg border border-clinical-200 bg-white p-4 shadow-sm sm:p-6" aria-busy={loadingComponent || paymentState === "processing"}>
            <h2 className="text-2xl font-semibold text-clinical-900">Pago con tarjeta</h2>
            <p className="mt-2 text-sm text-clinical-700">Tus datos de tarjeta son capturados de forma segura por Conekta.</p>
            {paymentState === "idle" ? <p className="mt-5 rounded-md bg-medical-50 p-4 text-sm text-medical-900">Completa tus datos de contacto y entrega para cargar el formulario seguro de pago.</p> : null}
            {loadingComponent ? <p className="mt-5 min-h-24 rounded-md bg-clinical-50 p-4 text-sm font-semibold text-medical-700">Cargando formulario seguro de pago…</p> : null}
            <div id="conekta-checkout" className={paymentState === "ready" || paymentState === "processing" ? "mt-5 w-full" : "w-full"} />
            {paymentState === "processing" ? <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90"><p className="font-semibold text-medical-700">Procesando pago…</p></div> : null}
            {error ? <div className="mt-4 rounded-md bg-red-50 p-4"><p role="alert" className="text-sm text-red-700">{error}</p>{paymentState === "error" ? <button type="button" onClick={() => void createCheckout()} className="mt-3 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white">Reintentar carga</button> : null}</div> : null}
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
  return <label className={`grid gap-2 text-sm font-semibold text-clinical-900 ${className}`}><span>{label}</span><input {...props} required className="rounded-md border border-clinical-200 px-4 py-3 font-normal outline-none transition focus:border-medical-500 focus:ring-4 focus:ring-medical-100 disabled:bg-clinical-50" /></label>;
}
