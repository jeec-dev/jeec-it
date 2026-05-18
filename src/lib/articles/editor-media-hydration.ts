import type { AdminMediaAssetListItem } from "@/lib/admin/media-assets";

import type { ArticleEditorBlockInput } from "./editor-contract";

function mediaAssetMap(mediaAssets: AdminMediaAssetListItem[]) {
  return new Map(mediaAssets.map((asset) => [asset.id, asset]));
}

export function hydrateEditorBlocksWithMediaAssets(
  blocks: ArticleEditorBlockInput[],
  mediaAssets: AdminMediaAssetListItem[],
): ArticleEditorBlockInput[] {
  const assetsById = mediaAssetMap(mediaAssets);

  return blocks.map((item) => {
    if (item.block.type === "IMAGE") {
      const assetId = item.block.content.mediaAssetId;
      const asset = assetId ? assetsById.get(assetId) : undefined;

      if (!asset) {
        return item;
      }

      return {
        ...item,
        block: {
          type: "IMAGE",
          layout: item.block.layout,
          content: {
            mediaAssetId: asset.id,
            url: item.block.content.url ?? asset.url,
            alt: item.block.content.alt ?? asset.alt ?? undefined,
            caption: item.block.content.caption ?? asset.caption ?? undefined,
          },
        },
      };
    }

    if (item.block.type === "IMAGE_TEXT") {
      const assetId = item.block.content.mediaAssetId;
      const asset = assetId ? assetsById.get(assetId) : undefined;

      if (!asset) {
        return item;
      }

      return {
        ...item,
        block: {
          type: "IMAGE_TEXT",
          layout: item.block.layout,
          content: {
            mediaAssetId: asset.id,
            url: item.block.content.url ?? asset.url,
            alt: item.block.content.alt ?? asset.alt ?? undefined,
            caption: item.block.content.caption ?? asset.caption ?? undefined,
            title: item.block.content.title,
            text: item.block.content.text,
            imagePosition: item.block.content.imagePosition,
          },
        },
      };
    }

    return item;
  });
}
