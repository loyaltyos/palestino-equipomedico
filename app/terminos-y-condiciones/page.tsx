import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      description="Condiciones generales aplicables al uso del sitio y solicitudes de compra en Palestina."
      sections={[
        {
          title: "Uso del sitio",
          body: "El catálogo de Palestina presenta productos médicos con información orientativa para facilitar solicitudes de compra y cotización. El uso del sitio implica aceptar estas condiciones generales."
        },
        {
          title: "Precios y disponibilidad",
          body: "Los precios publicados son referenciales y están expresados en pesos mexicanos. La disponibilidad, especificaciones, tiempos de entrega e importes finales serán confirmados por un asesor antes de cerrar la compra."
        },
        {
          title: "Pedidos",
          body: "El envío de un formulario, mensaje o carrito no constituye confirmación automática de compra. Un asesor validará datos, productos, entrega y método de pago antes de formalizar el pedido."
        }
      ]}
    />
  );
}
