import { renderArticleBlocksToHtml } from "@/lib/articles/render-html";

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

export type AdminArticleDetail = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  kind: string;
  status: string;
  publishedAt: Date | null;
  renderedAt: Date | null;
  contentVersion: number;
  metadata: unknown;
  html: string;
  coverAsset: {
    id: string;
    url: string;
    alt: string | null;
    caption: string | null;
  } | null;
  blocks: {
    id: string;
    type: string;
    layout: string;
    order: number;
    isPublic: boolean;
    content: unknown;
  }[];
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

export async function getAdminArticleById(
  articleId: string,
): Promise<AdminArticleDetail | null> {
  const article = await db.article.findUnique({
    where: {
      id: articleId,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      subtitle: true,
      excerpt: true,
      kind: true,
      status: true,
      coverAssetId: true,
      renderedHtml: true,
      renderedAt: true,
      contentVersion: true,
      metadata: true,
      publishedAt: true,
    },
  });

  if (!article) {
    return null;
  }

  const [blocks, coverAsset] = await Promise.all([
    db.articleContentBlock.findMany({
      where: {
        articleId: article.id,
      },
      orderBy: {
        order: "asc",
      },
    }),
    article.coverAssetId
      ? db.mediaAsset.findUnique({
          where: {
            id: article.coverAssetId,
          },
          select: {
            id: true,
            url: true,
            alt: true,
            caption: true,
          },
        })
      : null,
  ]);

  const html = article.renderedHtml ?? renderArticleBlocksToHtml(blocks);

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    kind: article.kind,
    status: article.status,
    publishedAt: article.publishedAt,
    renderedAt: article.renderedAt,
    contentVersion: article.contentVersion,
    metadata: article.metadata,
    html,
    coverAsset,
    blocks: blocks.map((block) => ({
      id: block.id,
      type: block.type,
      layout: block.layout,
      order: block.order,
      isPublic: block.isPublic,
      content: block.content,
    })),
  };
}
