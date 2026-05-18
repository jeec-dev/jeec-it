import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleRenderer } from "@/components/articles/ArticleRenderer";
import { getAdminArticleById } from "@/lib/admin/articles";

import styles from "./AdminArticlePreview.module.css";

export const dynamic = "force-dynamic";

type AdminArticlePreviewPageProps = {
  params: Promise<{
    articleId: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase();
}

function stringifyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default async function AdminArticlePreviewPage({
  params,
}: AdminArticlePreviewPageProps) {
  if (process.env.ADMIN_PREVIEW_ENABLED !== "true") {
    notFound();
  }

  const { articleId } = await params;
  const article = await getAdminArticleById(articleId);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.topbar}>
          <Link href="/admin/articles">← Torna agli articoli</Link>
          <Link href={`/diario-di-jay/${article.slug}`}>
            Apri pagina pubblica
          </Link>
          <Link href={`/admin/articles/${article.id}/edit`}>Modifica</Link>
        </div>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Admin preview · {article.kind}</p>
          <h1>{article.title}</h1>

          {article.subtitle ? (
            <p className={styles.subtitle}>{article.subtitle}</p>
          ) : null}
          {article.excerpt ? (
            <p className={styles.excerpt}>{article.excerpt}</p>
          ) : null}

          <dl className={styles.metaGrid}>
            <div>
              <dt>Status</dt>
              <dd>{formatStatus(article.status)}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{formatDate(article.publishedAt)}</dd>
            </div>
            <div>
              <dt>Rendered</dt>
              <dd>{formatDate(article.renderedAt)}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>v{article.contentVersion}</dd>
            </div>
            <div>
              <dt>Slug</dt>
              <dd>{article.slug}</dd>
            </div>
            <div>
              <dt>Blocks</dt>
              <dd>{article.blocks.length}</dd>
            </div>
          </dl>
        </header>

        {article.coverAsset ? (
          <figure className={styles.cover}>
            <Image
              src={article.coverAsset.url}
              alt={article.coverAsset.alt ?? article.title}
              width={1400}
              height={800}
              className={styles.coverImage}
            />
            {article.coverAsset.caption ? (
              <figcaption>{article.coverAsset.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        <section className={styles.previewPanel}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Rendered output</p>
            <h2>Preview articolo</h2>
          </div>

          <ArticleRenderer html={article.html} />
        </section>

        <section className={styles.debugGrid}>
          <article className={styles.debugPanel}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Structured source</p>
              <h2>Blocchi</h2>
            </div>

            <div className={styles.blockList}>
              {article.blocks.map((block) => (
                <details key={block.id} className={styles.blockCard}>
                  <summary>
                    <span>#{block.order}</span>
                    <strong>{block.type}</strong>
                    <em>{block.layout}</em>
                    {!block.isPublic ? <mark>hidden</mark> : null}
                  </summary>

                  <pre>{stringifyJson(block.content)}</pre>
                </details>
              ))}
            </div>
          </article>

          <article className={styles.debugPanel}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Metadata</p>
              <h2>JSON</h2>
            </div>

            <pre>{stringifyJson(article.metadata)}</pre>
          </article>
        </section>
      </section>
    </main>
  );
}
