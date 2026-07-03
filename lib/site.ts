export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const siteConfig = {
  brandName: "Palestina",
  footerText: "Palestina — Equipamiento médico",
  whatsappNumber: WHATSAPP_NUMBER,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
};

export function getWhatsAppUrl(message: string) {
  const encoded = encodeURIComponent(message);

  if (!siteConfig.whatsappNumber) {
    return `https://wa.me/?text=${encoded}`;
  }

  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encoded}`;
}
