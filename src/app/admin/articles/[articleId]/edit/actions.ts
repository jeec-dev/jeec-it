"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { editorBlocksToDbCreateManyInput } from "@/lib/articles/editor-blocks";
import { parseArticleEditorBlocks } from "@/lib/articles/editor-contract";
import { renderArticleBlocksToHtml } from "@/lib/articles/render-html";
import { db } from "@/lib/db";

export async function saveArticleEditorBlocks(
  articleId: string,
  input: unknown,
): Promise<void> {
  if (process.env.ADMIN_PREVIEW_ENABLED !== "true") {
    throw new Error("Admin editing is disabled.");
  }

  const parsedBlocks = parseArticleEditorBlocks(input);
  const createManyInput = editorBlocksToDbCreateManyInput(
    articleId,
    parsedBlocks,
  );

  const mediaAssetIds = Array.from(
    new Set(
      parsedBlocks
        .map((item) => {
          if (item.block.type === "IMAGE" || item.block.type === "IMAGE_TEXT") {
            return item.block.content.mediaAssetId;
          }

          return undefined;
        })
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const mediaAssets =
    mediaAssetIds.length > 0
      ? await db.mediaAsset.findMany({
          where: {
            id: {
              in: mediaAssetIds,
            },
          },
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            alt: true,
            caption: true,
          },
        })
      : [];

  const mediaById = new Map(mediaAssets.map((asset) => [asset.id, asset]));

  const renderableBlocks = createManyInput.map((block) => ({
    id: "",
    articleId: block.articleId,
    type: block.type,
    layout: block.layout,
    order: block.order,
    content: block.content,
    isPublic: block.isPublic,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const renderedHtml = renderArticleBlocksToHtml(renderableBlocks, mediaById);

  const article = await db.$transaction(async (tx) => {
    await tx.articleContentBlock.deleteMany({
      where: {
        articleId,
      },
    });

    if (createManyInput.length > 0) {
      await tx.articleContentBlock.createMany({
        data: createManyInput,
      });
    }

    return tx.article.update({
      where: {
        id: articleId,
      },
      data: {
        renderedHtml,
        renderedAt: new Date(),
        contentVersion: {
          increment: 1,
        },
      },
      select: {
        slug: true,
      },
    });
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath(`/admin/articles/${articleId}/edit`);
  revalidatePath(`/diario-di-jay/${article.slug}`);
  revalidatePath("/diario-di-jay");

  redirect(`/admin/articles/${articleId}`);
}
