import { getWhatsAppUrl } from "@/lib/site";
import { clsx } from "clsx";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type WhatsAppButtonProps = {
  label: string;
  compact?: boolean;
  message?: string;
  dark?: boolean;
};

export function WhatsAppButton({ label, compact, message, dark }: WhatsAppButtonProps) {
  return (
    <a
      href={getWhatsAppUrl(message ?? "Hola, me interesa recibir asesoría sobre equipamiento médico Palestina.")}
      target="_blank"
      rel="noreferrer"
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-bold transition",
        dark ? "border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20" : "border-[#1daf61]/25 bg-white text-[#128c4a] hover:bg-[#ecfff4]",
        compact ? "px-4 py-2.5" : "px-6 py-3"
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {label}
    </a>
  );
}

export function FloatingWhatsApp() {
  return <a href={getWhatsAppUrl("Hola, me interesa recibir asesoría sobre equipamiento médico Palestina.")} target="_blank" rel="noreferrer" aria-label="Contactar por WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1fb85a]"><WhatsAppIcon className="h-7 w-7" /></a>;
}
