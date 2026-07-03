import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Aviso de privacidad"
      description="Información sobre el tratamiento de datos personales compartidos con Palestina."
      sections={[
        {
          title: "Datos recabados",
          body: "Podemos solicitar nombre, teléfono, correo, dirección y comentarios relacionados con la compra o cotización de equipamiento médico."
        },
        {
          title: "Finalidad",
          body: "Los datos se utilizan para brindar asesoría, preparar cotizaciones, coordinar pedidos, confirmar entregas y dar seguimiento a solicitudes comerciales."
        },
        {
          title: "Protección de información",
          body: "La información será tratada de forma responsable y sólo se compartirá cuando sea necesario para procesar solicitudes, coordinar logística o cumplir obligaciones aplicables."
        }
      ]}
    />
  );
}
