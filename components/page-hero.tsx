export function PageHero({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-clinical-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-medical-600">Palestina</p>
        <h1 className="mt-3 text-4xl font-semibold text-clinical-900">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-clinical-700">{description}</p>
      </div>
    </section>
  );
}
