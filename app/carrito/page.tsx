import { CartView } from "@/components/cart-view";
import { PageHero } from "@/components/page-hero";

export default function CartPage() {
  return (
    <>
      <PageHero
        title="Carrito"
        description="Revisa cantidades, precios referenciales y continúa al checkout para enviar tu solicitud de compra."
      />
      <CartView />
    </>
  );
}
