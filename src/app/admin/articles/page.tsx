import Link from "next/link";
import { notFound } from "next/navigation";

import { getAdminArticles } from "@/lib/admin/articles";

import styles from "./AdminArticles.module.css";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase();
}

export default async function AdminArticlesPage() {
  if (process.env.ADMIN_PREVIEW_ENABLED !== "true") {
    notFound();
  }

  const articles = await getAdminArticles();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Admin foundation</p>
        <div className={styles.heroHeader}>
          <div>
            <h1>Articles</h1>
            <p>
              Prima vista read-only del sistema editoriale DB-backed. Questa
              pagina serve a verificare Article, renderer, seed e dati prima di
              introdurre create/edit.
            </p>
          </div>

          <span className={styles.badge}>Read-only</span>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Articoli nel database</h2>
            <p>{articles.length} contenuti editoriali trovati.</p>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Titolo</th>
                  <th>Kind</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Rendered</th>
                  <th>Version</th>
                  <th>Preview</th>
                </tr>
              </thead>

              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <strong>{article.title}</strong>
                      <span>{article.slug}</span>
                    </td>
                    <td>{article.kind}</td>
                    <td>
                      <span className={styles.status}>
                        {formatStatus(article.status)}
                      </span>
                    </td>
                    <td>{formatDate(article.publishedAt)}</td>
                    <td>{formatDate(article.renderedAt)}</td>
                    <td>v{article.contentVersion}</td>
                    <td>
                      <Link
                        className={styles.previewLink}
                        href={`/diario-di-jay/${article.slug}`}
                      >
                        Apri
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>Nessun articolo trovato</h3>
            <p>
              Esegui <code>npm run db:seed:articles</code> per ripopolare il
              sistema editoriale.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
