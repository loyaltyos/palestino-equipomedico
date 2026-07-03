import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir al inicio">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-medical-700 text-lg font-semibold text-white">
        P
      </span>
      <span className="leading-none">
        <span className="block font-serif text-2xl font-semibold text-clinical-900">{siteConfig.brandName}</span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-medical-700">Equipamiento médico</span>
      </span>
    </Link>
  );
}
