"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Result = { orderId: string; total: number; currency: string; items: Array<{ name: string; quantity: number; unitPrice: number }> };

export function PaymentResult({ kind }: { kind: "success" | "pending" | "error" }) {
  const [result, setResult] = useState<Result | null>(null);
  useEffect(() => {
    queueMicrotask(() => {
      try { const raw = sessionStorage.getItem("palestina-payment-result"); if (raw) setResult(JSON.parse(raw)); }
      catch { setResult(null); }
    });
  }, []);
  const title = kind === "success" ? "Pago aprobado" : kind === "pending" ? "Pago pendiente" : "No fue posible procesar el pago";
  const message = kind === "success" ? "Gracias por tu compra. Tu pedido fue confirmado." : kind === "pending" ? "Estamos esperando la confirmación del pago. No intentes pagar nuevamente." : "Revisa tus datos o utiliza otra tarjeta.";
  return <section className="bg-clinical-50 py-16"><div className="mx-auto max-w-2xl px-5"><div className="rounded-lg border border-clinical-200 bg-white p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-semibold text-clinical-900">{title}</h1><p className="mt-3 text-clinical-700">{message}</p>{result && kind !== "error" ? <div className="mt-7 rounded-lg bg-clinical-50 p-5"><p className="text-sm text-clinical-700">Pedido</p><p className="font-semibold text-clinical-900">{result.orderId}</p><div className="mt-5 grid gap-2">{result.items.map((item, index) => <div key={`${item.name}-${index}`} className="flex justify-between gap-4 text-sm"><span>{item.quantity} × {item.name}</span><span>{new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(item.unitPrice * item.quantity / 100)}</span></div>)}</div><div className="mt-5 flex justify-between border-t border-clinical-200 pt-4 font-semibold"><span>Total</span><span>{new Intl.NumberFormat("es-MX", { style: "currency", currency: result.currency }).format(result.total / 100)}</span></div></div> : null}<div className="mt-7 flex flex-wrap gap-3">{kind === "error" ? <Link href="/checkout" className="rounded-md bg-medical-700 px-5 py-3 text-sm font-semibold text-white">Intentar de nuevo</Link> : null}<Link href="/catalogo" className="rounded-md border border-clinical-200 px-5 py-3 text-sm font-semibold text-clinical-900">Volver al catálogo</Link></div></div></div></section>;
}
