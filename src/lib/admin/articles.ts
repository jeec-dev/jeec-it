import { db } from "../db";

export type AdminArticleListItem = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  status: string;
  publishedAt: Date | null;
  renderedAt: Date | null;
  contentVersion: number;
};

export async function getAdminArticles(): Promise<AdminArticleListItem[]> {
  const articles = await db.article.findMany({
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        title: "asc",
      },
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      kind: true,
      status: true,
      publishedAt: true,
      renderedAt: true,
      contentVersion: true,
    },
  });

  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    kind: article.kind,
    status: article.status,
    publishedAt: article.publishedAt,
    renderedAt: article.renderedAt,
    contentVersion: article.contentVersion,
  }));
}
