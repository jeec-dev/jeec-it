import type { PartialBlock } from "@blocknote/core";

import type { ArticleEditorBlockInput } from "./editor-contract";

export type UnknownBlock = {
  type?: string;
  props?: Record<string, unknown>;
  content?: unknown;
  children?: unknown[];
};

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getOptionalString(value: unknown): string | undefined {
  const text = getString(value).trim();

  return text.length > 0 ? text : undefined;
}

function inlineContentToText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (
        item &&
        typeof item === "object" &&
        "text" in item &&
        typeof item.text === "string"
      ) {
        return item.text;
      }

      if (
        item &&
        typeof item === "object" &&
        "content" in item &&
        typeof item.content === "string"
      ) {
        return item.content;
      }

      return "";
    })
    .join("");
}

function asBlockNotePartialBlock(block: unknown): PartialBlock {
  return block as PartialBlock;
}

export function editorBlocksToBlockNote(
  blocks: ArticleEditorBlockInput[],
): PartialBlock[] {
  if (blocks.length === 0) {
    return [
      {
        type: "paragraph",
        content: "",
      },
    ];
  }

  return blocks.map((item) => {
    const block = item.block;

    if (block.type === "PARAGRAPH") {
      return {
        type: "paragraph",
        content: block.content.text,
      };
    }

    if (block.type === "HEADING") {
      return {
        type: "heading",
        props: {
          level: block.content.level,
        },
        content: block.content.text,
      };
    }

    if (block.type === "QUOTE") {
      return {
        type: "quote",
        content: block.content.text,
      };
    }

    if (block.type === "IMAGE") {
      return asBlockNotePartialBlock({
        type: "jeecImage",
        props: {
          mediaAssetId: block.content.mediaAssetId ?? "",
          url: block.content.url ?? "",
          alt: block.content.alt ?? "",
          caption: block.content.caption ?? "",
        },
      });
    }

    if (block.type === "IMAGE_TEXT") {
      return asBlockNotePartialBlock({
        type: "jeecImageText",
        props: {
          mediaAssetId: block.content.mediaAssetId ?? "",
          url: block.content.url ?? "",
          alt: block.content.alt ?? "",
          caption: block.content.caption ?? "",
          title: block.content.title ?? "",
          imagePosition: block.content.imagePosition,
        },
        content: block.content.text,
      });
    }

    if (block.type === "CALLOUT") {
      return asBlockNotePartialBlock({
        type: "jeecCallout",
        props: {
          tone: block.content.tone,
          title: block.content.title ?? "",
        },
        content: block.content.text,
      });
    }

    if (block.type === "DIVIDER") {
      return asBlockNotePartialBlock({
        type: "jeecDivider",
        props: {
          label: block.content.label ?? "",
        },
      });
    }

    if (block.type === "CTA") {
      return asBlockNotePartialBlock({
        type: "jeecCta",
        props: {
          label: block.content.label,
          href: block.content.href,
          description: block.content.description ?? "",
        },
      });
    }

    if (block.type === "RELATED_CONTENT") {
      return asBlockNotePartialBlock({
        type: "jeecRelatedContent",
        props: {
          ownerEntityKey: block.content.ownerEntityKey ?? "",
          title: block.content.title ?? "",
        },
      });
    }

    if (block.type === "VIDEO") {
      return {
        type: "paragraph",
        content: `[VIDEO] ${block.content.title ?? block.content.url}`,
      };
    }

    return {
      type: "paragraph",
      content: "",
    };
  });
}

export function blockNoteToEditorBlocks(
  blocks: UnknownBlock[],
): ArticleEditorBlockInput[] {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const rawLevel = block.props?.level;
      const level = typeof rawLevel === "number" ? rawLevel : 2;

      return {
        order: index,
        isPublic: true,
        block: {
          type: "HEADING",
          layout: "DEFAULT",
          content: {
            level: Math.min(Math.max(level, 1), 3),
            text: inlineContentToText(block.content),
          },
        },
      };
    }

    if (block.type === "quote") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "QUOTE",
          layout: "DEFAULT",
          content: {
            text: inlineContentToText(block.content),
          },
        },
      };
    }

    if (block.type === "jeecImage") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "IMAGE",
          layout: "WIDE",
          content: {
            mediaAssetId: getOptionalString(block.props?.mediaAssetId),
            url: getOptionalString(block.props?.url),
            alt: getOptionalString(block.props?.alt),
            caption: getOptionalString(block.props?.caption),
          },
        },
      };
    }

    if (block.type === "jeecImageText") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "IMAGE_TEXT",
          layout: "SPLIT",
          content: {
            mediaAssetId: getOptionalString(block.props?.mediaAssetId),
            url: getOptionalString(block.props?.url),
            alt: getOptionalString(block.props?.alt),
            caption: getOptionalString(block.props?.caption),
            title: getOptionalString(block.props?.title),
            text: inlineContentToText(block.content),
            imagePosition:
              block.props?.imagePosition === "right" ? "right" : "left",
          },
        },
      };
    }

    if (block.type === "jeecCallout") {
      const rawTone = getString(block.props?.tone);
      const tone =
        rawTone === "warning" || rawTone === "lore" || rawTone === "signal"
          ? rawTone
          : "note";

      return {
        order: index,
        isPublic: true,
        block: {
          type: "CALLOUT",
          layout: "WIDE",
          content: {
            tone,
            title: getOptionalString(block.props?.title),
            text: inlineContentToText(block.content),
          },
        },
      };
    }

    if (block.type === "jeecDivider") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "DIVIDER",
          layout: "DEFAULT",
          content: {
            label: getOptionalString(block.props?.label),
          },
        },
      };
    }

    if (block.type === "jeecCta") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "CTA",
          layout: "WIDE",
          content: {
            label: getString(block.props?.label) || "Apri",
            href: getString(block.props?.href) || "/",
            description: getOptionalString(block.props?.description),
          },
        },
      };
    }

    if (block.type === "jeecRelatedContent") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "RELATED_CONTENT",
          layout: "WIDE",
          content: {
            ownerEntityKey: getOptionalString(block.props?.ownerEntityKey),
            title: getOptionalString(block.props?.title),
          },
        },
      };
    }

    if (block.type === "image") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "IMAGE",
          layout: "WIDE",
          content: {
            url: getOptionalString(block.props?.url),
            alt: getOptionalString(block.props?.name),
            caption: getOptionalString(block.props?.caption),
          },
        },
      };
    }

    if (block.type === "video") {
      return {
        order: index,
        isPublic: true,
        block: {
          type: "VIDEO",
          layout: "WIDE",
          content: {
            url: getString(block.props?.url) || "/",
            title: getOptionalString(block.props?.name),
            caption: getOptionalString(block.props?.caption),
            provider: "EXTERNAL",
          },
        },
      };
    }

    return {
      order: index,
      isPublic: true,
      block: {
        type: "PARAGRAPH",
        layout: "DEFAULT",
        content: {
          text: inlineContentToText(block.content),
        },
      },
    };
  });
}
