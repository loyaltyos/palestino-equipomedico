import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-clinical-50 py-24">
      <div className="mx-auto max-w-xl px-5 text-center">
        <h1 className="text-4xl font-semibold text-clinical-900">Página no encontrada</h1>
        <p className="mt-4 text-clinical-700">La sección que buscas no está disponible.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-medical-700 px-6 py-3 text-sm font-semibold text-white hover:bg-medical-800"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
