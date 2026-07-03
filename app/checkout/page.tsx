import { CheckoutView } from "@/components/checkout-view";
import { PageHero } from "@/components/page-hero";

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        title="Checkout"
        description="Completa tus datos para que un asesor confirme disponibilidad, entrega y cierre de compra."
      />
      <CheckoutView />
    </>
  );
}
