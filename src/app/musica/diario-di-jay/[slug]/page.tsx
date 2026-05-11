import Link from "next/link";
import { notFound } from "next/navigation";
import { diaryEntries, getDiaryEntryBySlug } from "@/lib/diary";

type DiaryEntryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return diaryEntries.map((entry) => ({
    slug: entry.metadata.slug,
  }));
}

export async function generateMetadata({ params }: DiaryEntryPageProps) {
  const { slug } = await params;
  const entry = getDiaryEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Frammento non trovato | JEEC",
    };
  }

  return {
    title: `${entry.metadata.title} | Diario di Jay`,
    description: entry.metadata.excerpt,
  };
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { slug } = await params;
  const entry = getDiaryEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const EntryComponent = entry.Component;

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <article className="prose prose-invert mx-auto max-w-3xl prose-headings:text-white prose-p:text-white/70 prose-blockquote:border-white/20 prose-blockquote:text-white/70">
        <Link
          href="/musica/diario-di-jay"
          className="not-prose mb-8 inline-flex text-sm text-white/50 transition hover:text-white"
        >
          ← Torna al Diario
        </Link>

        <EntryComponent />
      </article>
    </main>
  );
}