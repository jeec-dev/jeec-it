import type { AdminMediaAssetListItem } from "@/lib/admin/media-assets";
import type { ArticleEditorBlockInput } from "@/lib/articles/editor-contract";

export type ArticleBlockEditorProps = {
  articleId: string;
  initialBlocks: ArticleEditorBlockInput[];
  mediaAssets?: AdminMediaAssetListItem[];
  onSave: (
    articleId: string,
    blocks: ArticleEditorBlockInput[],
  ) => Promise<void>;
};
