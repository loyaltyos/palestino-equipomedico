import { LegalPage } from "@/components/legal-page";

export default function ReturnsPage() {
  return (
    <LegalPage
      title="Política de devoluciones"
      description="Criterios generales para cambios, devoluciones y revisión de incidencias."
      sections={[
        {
          title: "Revisión de solicitudes",
          body: "Las devoluciones o cambios se revisan de forma individual considerando el tipo de producto, estado del empaque, condiciones de uso y motivo de la solicitud."
        },
        {
          title: "Productos médicos e insumos",
          body: "Por seguridad e higiene, algunos insumos o productos médicos pueden no ser elegibles para devolución una vez abiertos, usados o manipulados fuera de su empaque original."
        },
        {
          title: "Incidencias",
          body: "Si existe daño, error de envío o faltante, el cliente deberá reportarlo con evidencia para que el equipo de Palestina pueda dar seguimiento y ofrecer una solución adecuada."
        }
      ]}
    />
  );
}
