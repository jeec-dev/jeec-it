import { z } from "zod";

export const articleEditorBlockTypeSchema = z.enum([
  "PARAGRAPH",
  "HEADING",
  "IMAGE",
  "IMAGE_TEXT",
  "VIDEO",
  "QUOTE",
  "CALLOUT",
  "DIVIDER",
  "CTA",
  "RELATED_CONTENT",
]);

export const articleEditorBlockLayoutSchema = z.enum([
  "DEFAULT",
  "INLINE",
  "WIDE",
  "FULL_BLEED",
  "GRID_2",
  "GRID_3",
  "CAROUSEL",
  "SPLIT",
]);

export const paragraphContentSchema = z.object({
  text: z.string().default(""),
});

export const headingContentSchema = z.object({
  level: z.coerce.number().int().min(1).max(3).default(2),
  text: z.string().default(""),
});

export const quoteContentSchema = z.object({
  text: z.string().default(""),
  attribution: z.string().optional(),
});

export const calloutContentSchema = z.object({
  tone: z.enum(["note", "warning", "lore", "signal"]).default("note"),
  title: z.string().optional(),
  text: z.string().default(""),
});

export const dividerContentSchema = z.object({
  label: z.string().optional(),
});

export const imageContentSchema = z.object({
  mediaAssetId: z.string().uuid().optional(),
  url: z.string().min(1).optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const imageTextContentSchema = z.object({
  mediaAssetId: z.string().uuid().optional(),
  url: z.string().min(1).optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  title: z.string().optional(),
  text: z.string().default(""),
  imagePosition: z.enum(["left", "right"]).default("left"),
});

export const videoContentSchema = z.object({
  url: z.string().min(1),
  title: z.string().optional(),
  caption: z.string().optional(),
  provider: z.enum(["YOUTUBE", "VIMEO", "EXTERNAL"]).default("EXTERNAL"),
});

export const ctaContentSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  description: z.string().optional(),
});

export const relatedContentContentSchema = z.object({
  ownerEntityKey: z.string().min(1).optional(),
  title: z.string().optional(),
});

export const articleEditorBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("PARAGRAPH"),
    layout: articleEditorBlockLayoutSchema.default("DEFAULT"),
    content: paragraphContentSchema,
  }),
  z.object({
    type: z.literal("HEADING"),
    layout: articleEditorBlockLayoutSchema.default("DEFAULT"),
    content: headingContentSchema,
  }),
  z.object({
    type: z.literal("QUOTE"),
    layout: articleEditorBlockLayoutSchema.default("DEFAULT"),
    content: quoteContentSchema,
  }),
  z.object({
    type: z.literal("CALLOUT"),
    layout: articleEditorBlockLayoutSchema.default("WIDE"),
    content: calloutContentSchema,
  }),
  z.object({
    type: z.literal("DIVIDER"),
    layout: articleEditorBlockLayoutSchema.default("DEFAULT"),
    content: dividerContentSchema,
  }),
  z.object({
    type: z.literal("IMAGE"),
    layout: articleEditorBlockLayoutSchema.default("WIDE"),
    content: imageContentSchema,
  }),
  z.object({
    type: z.literal("IMAGE_TEXT"),
    layout: articleEditorBlockLayoutSchema.default("SPLIT"),
    content: imageTextContentSchema,
  }),
  z.object({
    type: z.literal("VIDEO"),
    layout: articleEditorBlockLayoutSchema.default("WIDE"),
    content: videoContentSchema,
  }),
  z.object({
    type: z.literal("CTA"),
    layout: articleEditorBlockLayoutSchema.default("WIDE"),
    content: ctaContentSchema,
  }),
  z.object({
    type: z.literal("RELATED_CONTENT"),
    layout: articleEditorBlockLayoutSchema.default("WIDE"),
    content: relatedContentContentSchema,
  }),
]);

export const articleEditorBlockInputSchema = z.object({
  id: z.string().optional(),
  order: z.coerce.number().int().min(0),
  isPublic: z.boolean().default(true),
  block: articleEditorBlockSchema,
});

export const articleEditorBlocksInputSchema = z.array(articleEditorBlockInputSchema);

export type ArticleEditorBlock = z.infer<typeof articleEditorBlockSchema>;
export type ArticleEditorBlockInput = z.infer<typeof articleEditorBlockInputSchema>;

export function normalizeArticleEditorBlocks(
  blocks: ArticleEditorBlockInput[],
): ArticleEditorBlockInput[] {
  return blocks.map((block, index) => ({
    ...block,
    order: index,
    isPublic: block.isPublic ?? true,
  }));
}

export function parseArticleEditorBlocks(input: unknown): ArticleEditorBlockInput[] {
  return normalizeArticleEditorBlocks(articleEditorBlocksInputSchema.parse(input));
}
