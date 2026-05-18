import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleBlockEditor } from "@/components/admin/articles/ArticleBlockEditor";
import { getAdminArticleById } from "@/lib/admin/articles";
import { getAdminMediaAssets } from "@/lib/admin/media-assets";
import { dbBlocksToEditorBlocks } from "@/lib/articles/editor-blocks";
import { hydrateEditorBlocksWithMediaAssets } from "@/lib/articles/editor-media-hydration";

import { saveArticleEditorBlocks } from "./actions";
import styles from "./EditArticlePage.module.css";

export const dynamic = "force-dynamic";

type EditArticlePageProps = {
  params: Promise<{
    articleId: string;
  }>;
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  if (process.env.ADMIN_PREVIEW_ENABLED !== "true") {
    notFound();
  }

  const { articleId } = await params;
  const [article, mediaAssets] = await Promise.all([
    getAdminArticleById(articleId),
    getAdminMediaAssets(),
  ]);

  if (!article) {
    notFound();
  }

  const initialBlocks = hydrateEditorBlocksWithMediaAssets(
    dbBlocksToEditorBlocks(article.blocks),
    mediaAssets,
  );

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.topbar}>
          <Link href={`/admin/articles/${article.id}`}>← Preview admin</Link>
          <Link href="/admin/media">Media library</Link>
          <Link href="/admin/articles">Lista articoli</Link>
        </div>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Article editor</p>
          <h1>{article.title}</h1>
          <p>
            Prima shell editoriale: UI BlockNote, salvataggio su blocchi
            canonici jeec.it, cache HTML rigenerata lato server.
          </p>
        </header>

        <ArticleBlockEditor
          articleId={article.id}
          initialBlocks={initialBlocks}
          mediaAssets={mediaAssets}
          onSave={saveArticleEditorBlocks}
        />
      </section>
    </main>
  );
}
