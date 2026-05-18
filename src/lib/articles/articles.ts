import {
  $Enums,
  type ArticleContentBlock,
  type Prisma,
} from "@/generated/prisma";
import { db } from "@/lib/db";
import { renderArticleBlocksToHtml } from "./render-html";

type ArticleMetadata = {
  chapter?: string;
  displayDate?: string;
  narrativeDate?: string;
  linkedTrackSlug?: string;
  linkedTrackTitle?: string;
};

function getMetadataValue(
  metadata: Prisma.JsonValue | null,
  key: keyof ArticleMetadata,
) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return undefined;
  }

  const value = metadata[key];

  return typeof value === "string" ? value : undefined;
}

function collectAssetIds(blocks: ArticleContentBlock[]) {
  const assetIds = new Set<string>();

  for (const block of blocks) {
    if (
      !block.content ||
      typeof block.content !== "object" ||
      Array.isArray(block.content)
    ) {
      continue;
    }

    const assetId = block.content.assetId;

    if (typeof assetId === "string") {
      assetIds.add(assetId);
    }

    const assetIdsValue = block.content.assetIds;

    if (Array.isArray(assetIdsValue)) {
      for (const value of assetIdsValue) {
        if (typeof value === "string") {
          assetIds.add(value);
        }
      }
    }
  }

  return [...assetIds];
}

async function renderArticleFallback(blocks: ArticleContentBlock[]) {
  const assetIds = collectAssetIds(blocks);

  const mediaAssets =
    assetIds.length > 0
      ? await db.mediaAsset.findMany({
          where: {
            id: {
              in: assetIds,
            },
          },
        })
      : [];

  return renderArticleBlocksToHtml(
    blocks.map((block) => ({
      type: block.type,
      layout: block.layout,
      content: block.content,
    })),
    new Map(mediaAssets.map((asset) => [asset.id, asset])),
  );
}

async function getLinkedTrack(articleId: string) {
  const articleEntity = await db.contentEntity.findUnique({
    where: {
      key: `article:${articleId}`,
    },
    select: {
      id: true,
    },
  });

  if (!articleEntity) {
    return null;
  }

  const relation = await db.contentRelation.findFirst({
    where: {
      sourceEntityId: articleEntity.id,
      status: $Enums.ContentRelationStatus.APPROVED,
      isPublic: true,
      targetEntity: {
        type: $Enums.ContentEntityType.MUSIC,
        kindKey: "TRACK",
      },
    },
    include: {
      targetEntity: true,
    },
    orderBy: [{ priority: "desc" }, { order: "asc" }],
  });

  if (!relation || !relation.targetEntity.href) {
    return null;
  }

  return {
    title: relation.targetEntity.title,
    href: relation.targetEntity.href,
  };
}

export async function getDiaryArticles() {
  return db.article.findMany({
    where: {
      kind: $Enums.ArticleKind.DIARY_ENTRY,
      status: $Enums.ArticleStatus.PUBLISHED,
    },
    include: {
      coverAsset: true,
    },
    orderBy: {
      publishedAt: "asc",
    },
  });
}

export async function getDiaryArticleBySlug(slug: string) {
  const article = await db.article.findFirst({
    where: {
      slug,
      kind: $Enums.ArticleKind.DIARY_ENTRY,
      status: $Enums.ArticleStatus.PUBLISHED,
    },
    include: {
      coverAsset: true,
      blocks: {
        where: {
          isPublic: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!article) {
    return null;
  }

  const html =
    article.renderedHtml ?? (await renderArticleFallback(article.blocks));
  const linkedTrack = await getLinkedTrack(article.id);

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    cover: article.coverAsset,
    html,
    linkedTrack,
    metadata: {
      chapter: getMetadataValue(article.metadata, "chapter"),
      displayDate: getMetadataValue(article.metadata, "displayDate"),
      narrativeDate: getMetadataValue(article.metadata, "narrativeDate"),
      linkedTrackSlug: getMetadataValue(article.metadata, "linkedTrackSlug"),
      linkedTrackTitle: getMetadataValue(article.metadata, "linkedTrackTitle"),
    },
  };
}

export async function getAdjacentDiaryArticles(slug: string) {
  const articles = await getDiaryArticles();
  const currentIndex = articles.findIndex((article) => article.slug === slug);

  if (currentIndex === -1) {
    return {
      previousArticle: null,
      nextArticle: null,
    };
  }

  return {
    previousArticle: articles[currentIndex - 1] ?? null,
    nextArticle: articles[currentIndex + 1] ?? null,
  };
}
