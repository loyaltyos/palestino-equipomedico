import { LegalPage } from "@/components/legal-page";

export default function ShippingPage() {
  return (
    <LegalPage
      title="Política de envíos"
      description="Lineamientos generales para la coordinación de entregas de productos médicos."
      sections={[
        {
          title: "Cobertura",
          body: "Los envíos se coordinan según tipo de producto, volumen, ubicación y disponibilidad logística. La cobertura final se confirmará durante la atención del pedido."
        },
        {
          title: "Tiempos de entrega",
          body: "Los tiempos de entrega pueden variar de acuerdo con inventario, preparación del equipo y destino. Un asesor comunicará una fecha estimada antes de finalizar la compra."
        },
        {
          title: "Recepción",
          body: "Al recibir el producto, el cliente deberá revisar el empaque y reportar cualquier incidencia de forma inmediata para facilitar el seguimiento correspondiente."
        }
      ]}
    />
  );
}
