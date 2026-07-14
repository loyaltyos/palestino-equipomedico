import { CheckoutView } from "@/components/checkout-view";
import { PageHero } from "@/components/page-hero";

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        title="Checkout"
        description="Completa tus datos de entrega y realiza tu pago de forma segura."
      />
      <CheckoutView />
    </>
  );
}
