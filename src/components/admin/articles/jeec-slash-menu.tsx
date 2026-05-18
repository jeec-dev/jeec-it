"use client";

import {
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core/extensions";
import {
  type DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";

const allowedDefaultTitles = new Set([
  "Paragraph",
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Quote",
]);

const getDefaultItems = getDefaultReactSlashMenuItems as unknown as (
  editor: unknown,
) => DefaultReactSuggestionItem[];

const insertForSlashMenu = insertOrUpdateBlockForSlashMenu as unknown as (
  editor: unknown,
  block: unknown,
) => void;

function insertCustomBlock(editor: unknown, block: unknown) {
  insertForSlashMenu(editor, block);
}

function jeecVideoItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC Video",
    group: "JeeC blocks",
    aliases: ["video", "youtube", "vimeo", "embed"],
    subtext: "Inserisce un blocco VIDEO embedded.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecVideo",
        props: {
          url: "",
          title: "",
          caption: "",
          provider: "YOUTUBE",
        },
      }),
  };
}

function jeecImageItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC Image",
    group: "JeeC blocks",
    aliases: ["image", "immagine", "media", "asset"],
    subtext: "Inserisce un blocco IMAGE canonico jeec.it.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecImage",
        props: {
          url: "",
          alt: "",
          caption: "",
          mediaAssetId: "",
        },
      }),
  };
}

function jeecImageTextItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC Image/Text",
    group: "JeeC blocks",
    aliases: ["image text", "cinematic", "split", "immagine testo"],
    subtext: "Inserisce un blocco IMAGE_TEXT nel punto corrente.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecImageText",
        props: {
          url: "",
          alt: "",
          caption: "",
          mediaAssetId: "",
          title: "Nuovo blocco cinematico",
          imagePosition: "left",
        },
        content: "",
      }),
  };
}

function jeecCalloutItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC Callout",
    group: "JeeC blocks",
    aliases: ["callout", "nota", "lore", "signal"],
    subtext: "Inserisce un blocco CALLOUT canonico.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecCallout",
        props: {
          tone: "note",
          title: "Nota",
        },
        content: "",
      }),
  };
}

function jeecDividerItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC Divider",
    group: "JeeC blocks",
    aliases: ["divider", "separator", "separatore"],
    subtext: "Inserisce un DIVIDER canonico.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecDivider",
        props: {
          label: "",
        },
      }),
  };
}

function jeecCtaItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC CTA",
    group: "JeeC blocks",
    aliases: ["cta", "button", "link", "call to action"],
    subtext: "Inserisce un blocco CTA.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecCta",
        props: {
          label: "Apri",
          href: "/",
          description: "",
        },
      }),
  };
}

function jeecRelatedContentItem(editor: unknown): DefaultReactSuggestionItem {
  return {
    title: "JeeC Related Content",
    group: "JeeC blocks",
    aliases: ["related", "correlati", "content"],
    subtext: "Inserisce un placeholder RELATED_CONTENT.",
    onItemClick: () =>
      insertCustomBlock(editor, {
        type: "jeecRelatedContent",
        props: {
          ownerEntityKey: "",
          title: "",
        },
      }),
  };
}

export function getJeecSlashMenuItems(
  editor: unknown,
  query: string,
): DefaultReactSuggestionItem[] {
  const defaultItems = getDefaultItems(editor).filter((item) =>
    allowedDefaultTitles.has(item.title),
  );

  const jeecItems = [
    jeecImageItem(editor),
    jeecImageTextItem(editor),
    jeecCalloutItem(editor),
    jeecDividerItem(editor),
    jeecVideoItem(editor),
    jeecCtaItem(editor),
    jeecRelatedContentItem(editor),
  ];

  return filterSuggestionItems([...defaultItems, ...jeecItems], query);
}
