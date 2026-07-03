import { PageHero } from "@/components/page-hero";

type LegalPageProps = {
  title: string;
  description: string;
  sections: {
    title: string;
    body: string;
  }[];
};

export function LegalPage({ title, description, sections }: LegalPageProps) {
  return (
    <>
      <PageHero title={title} description={description} />
      <section className="bg-clinical-50 py-12">
        <article className="mx-auto max-w-4xl rounded-lg border border-clinical-200 bg-white px-5 py-8 shadow-sm sm:px-8">
          <div className="grid gap-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-clinical-900">{section.title}</h2>
                <p className="mt-3 leading-7 text-clinical-700">{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
