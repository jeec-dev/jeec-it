import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getAdjacentDiaryEntries,
  getDiaryEntries,
  getDiaryEntry,
} from "@/lib/diary";
import styles from "./DiaryEntry.module.css";

type DiaryEntryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const entries = await getDiaryEntries();

  return entries.map((entry) => ({
    slug: entry.metadata.slug,
  }));
}

export async function generateMetadata({ params }: DiaryEntryPageProps) {
  const { slug } = await params;
  const entry = await getDiaryEntry(slug);

  if (!entry) {
    return {
      title: "Capitolo non trovato",
    };
  }

  return {
    title: `${entry.metadata.title} | Diario di Jay | JeeC`,
    description: entry.metadata.excerpt,
  };
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { slug } = await params;
  const entry = await getDiaryEntry(slug);

  if (!entry) {
    notFound();
  }

  const { previousEntry, nextEntry } = await getAdjacentDiaryEntries(slug);

  const { content } = await compileMDX({
    source: entry.source,
    options: {
      parseFrontmatter: false,
    },
  });

  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <Link href="/diario-di-jay" className={styles.backLink}>
          ← Torna al diario
        </Link>

        <header className={styles.header}>
          <p className={styles.kicker}>{entry.metadata.chapter}</p>

          <h1 className={styles.title}>{entry.metadata.title}</h1>

          <div className={styles.meta}>
            <span>{entry.metadata.displayDate}</span>

            {entry.metadata.narrativeDate ? (
              <span>Data narrativa: {entry.metadata.narrativeDate}</span>
            ) : null}
          </div>

          <p className={styles.excerpt}>{entry.metadata.excerpt}</p>
        </header>

        {entry.metadata.cover ? (
          <div className={styles.coverFrame}>
            <Image
              src={entry.metadata.cover}
              alt={`Cover di ${entry.metadata.title}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 48rem"
              className={styles.coverImage}
            />
          </div>
        ) : null}

        <div className={styles.body}>{content}</div>

        {entry.metadata.linkedTrackSlug ? (
          <Link
            href={`/musica/${entry.metadata.linkedTrackSlug}`}
            className={styles.trackCta}
          >
            Ascolta {entry.metadata.linkedTrackTitle ?? "la traccia"} →
          </Link>
        ) : null}

        <nav className={styles.navigation} aria-label="Navigazione diario">
          {previousEntry ? (
            <Link
              href={`/diario-di-jay/${previousEntry.metadata.slug}`}
              className={styles.navCard}
            >
              <span>Capitolo precedente</span>
              {previousEntry.metadata.title}
            </Link>
          ) : (
            <span />
          )}

          {nextEntry ? (
            <Link
              href={`/diario-di-jay/${nextEntry.metadata.slug}`}
              className={styles.navCard}
            >
              <span>Capitolo successivo</span>
              {nextEntry.metadata.title}
            </Link>
          ) : null}
        </nav>
      </article>
    </main>
  );
}
