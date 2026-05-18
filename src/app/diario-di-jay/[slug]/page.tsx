import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleRenderer } from "@/components/articles/ArticleRenderer";
import {
  getAdjacentDiaryArticles,
  getDiaryArticleBySlug,
  getDiaryArticles,
} from "@/lib/articles/articles";
import styles from "./DiaryEntry.module.css";

type DiaryEntryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const entries = await getDiaryArticles();

  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: DiaryEntryPageProps) {
  const { slug } = await params;
  const article = await getDiaryArticleBySlug(slug);

  if (!article) {
    return {
      title: "Capitolo non trovato",
    };
  }

  return {
    title: `${article.title} | Diario di Jay | JeeC`,
    description: article.excerpt,
  };
}

export default async function DiaryEntryPage({ params }: DiaryEntryPageProps) {
  const { slug } = await params;
  const article = await getDiaryArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { previousArticle, nextArticle } = await getAdjacentDiaryArticles(slug);

  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <Link href="/diario-di-jay" className={styles.backLink}>
          ← Torna al diario
        </Link>

        <header className={styles.header}>
          {article.metadata.chapter ? (
            <p className={styles.kicker}>{article.metadata.chapter}</p>
          ) : null}

          <h1 className={styles.title}>{article.title}</h1>

          <div className={styles.meta}>
            {article.metadata.displayDate ? (
              <span>{article.metadata.displayDate}</span>
            ) : null}

            {article.metadata.narrativeDate ? (
              <span>Data narrativa: {article.metadata.narrativeDate}</span>
            ) : null}
          </div>

          {article.excerpt ? (
            <p className={styles.excerpt}>{article.excerpt}</p>
          ) : null}
        </header>

        {article.cover ? (
          <div className={styles.coverFrame}>
            <Image
              src={article.cover.url}
              alt={article.cover.alt ?? `Cover di ${article.title}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 48rem"
              className={styles.coverImage}
            />
          </div>
        ) : null}

        <div className={styles.body}>
          <ArticleRenderer html={article.html} />
        </div>

        {article.linkedTrack ? (
          <Link href={article.linkedTrack.href} className={styles.trackCta}>
            Ascolta {article.linkedTrack.title} →
          </Link>
        ) : null}

        <nav className={styles.navigation} aria-label="Navigazione diario">
          {previousArticle ? (
            <Link
              href={`/diario-di-jay/${previousArticle.slug}`}
              className={styles.navCard}
            >
              <span>Capitolo precedente</span>
              {previousArticle.title}
            </Link>
          ) : (
            <span />
          )}

          {nextArticle ? (
            <Link
              href={`/diario-di-jay/${nextArticle.slug}`}
              className={styles.navCard}
            >
              <span>Capitolo successivo</span>
              {nextArticle.title}
            </Link>
          ) : null}
        </nav>
      </article>
    </main>
  );
}
