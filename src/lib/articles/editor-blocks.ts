import type { ArticleContentBlock } from "@/generated/prisma";

import {
  type ArticleEditorBlockInput,
  parseArticleEditorBlocks,
} from "./editor-contract";

export function dbBlocksToEditorBlocks(
  blocks: Pick<
    ArticleContentBlock,
    "id" | "type" | "layout" | "order" | "content" | "isPublic"
  >[],
): ArticleEditorBlockInput[] {
  return parseArticleEditorBlocks(
    blocks.map((block) => ({
      id: block.id,
      order: block.order,
      isPublic: block.isPublic,
      block: {
        type: block.type,
        layout: block.layout,
        content: block.content,
      },
    })),
  );
}

export function editorBlocksToDbCreateManyInput(
  articleId: string,
  blocks: ArticleEditorBlockInput[],
) {
  const parsed = parseArticleEditorBlocks(blocks);

  return parsed.map((item) => ({
    articleId,
    type: item.block.type,
    layout: item.block.layout,
    order: item.order,
    isPublic: item.isPublic,
    content: item.block.content,
  }));
}
