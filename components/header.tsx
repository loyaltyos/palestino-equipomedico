"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useCart } from "@/components/cart-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  return <header className="sticky top-0 z-40 border-b border-clinical-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-5 sm:px-6 lg:px-8">
      <Logo />
      <form action="/catalogo" className="relative ml-auto hidden max-w-md flex-1 lg:block">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-clinical-700" />
        <input name="q" type="search" placeholder="Buscar camas, diagnóstico, movilidad..." aria-label="Buscar productos" className="h-11 w-full rounded-xl border border-clinical-200 bg-clinical-50 pl-11 pr-4 text-sm outline-none transition focus:border-medical-400 focus:bg-white focus:ring-2 focus:ring-medical-100" />
      </form>
      <nav className="hidden items-center gap-6 md:flex" aria-label="Navegación principal"><Link href="/" className="text-sm font-bold text-clinical-700 hover:text-medical-700">Inicio</Link><Link href="/catalogo" className="text-sm font-bold text-clinical-700 hover:text-medical-700">Catálogo</Link><Link href="/contacto" className="text-sm font-bold text-clinical-700 hover:text-medical-700">Contacto</Link></nav>
      <div className="hidden items-center gap-2 md:flex"><WhatsAppButton label="WhatsApp" compact /><CartLink count={itemCount} /></div>
      <button type="button" onClick={() => setOpen(!open)} aria-label="Abrir menú" className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg border border-clinical-200 md:hidden">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="border-t border-clinical-200 bg-white p-5 md:hidden"><form action="/catalogo" className="relative mb-5"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"/><input name="q" type="search" placeholder="Buscar productos" className="h-11 w-full rounded-lg border border-clinical-200 pl-11 pr-4"/></form><nav className="grid gap-4 font-bold"><Link href="/" onClick={()=>setOpen(false)}>Inicio</Link><Link href="/catalogo" onClick={()=>setOpen(false)}>Catálogo</Link><Link href="/contacto" onClick={()=>setOpen(false)}>Contacto</Link><Link href="/carrito" onClick={()=>setOpen(false)}>Carrito ({itemCount})</Link><WhatsAppButton label="Cotizar por WhatsApp" /></nav></div>}
  </header>;
}

function CartLink({count}:{count:number}) { return <Link href="/carrito" aria-label={`Ver carrito, ${count} productos`} className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-clinical-200 text-clinical-900 hover:border-medical-300"><ShoppingCart className="h-5 w-5" />{count > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-medical-700 px-1 text-xs font-bold text-white">{count}</span>}</Link> }
