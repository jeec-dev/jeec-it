import { $Enums, type MediaAsset } from "@/generated/prisma";
import {
  getVideoEmbedUrl,
  normalizeVideoProvider,
} from "@/lib/articles/video-embeds";

type ArticleBlockForRender = {
  type: $Enums.ArticleBlockType;
  layout: $Enums.ArticleBlockLayout;
  content: unknown;
};

type MediaAssetMap = Map<
  string,
  Pick<MediaAsset, "id" | "url" | "thumbnailUrl" | "alt" | "caption">
>;

type ImageBlockContent = {
  mediaAssetId?: string;
  url?: string;
  alt?: string;
  caption?: string;
};

type ImageTextBlockContent = {
  mediaAssetId?: string;
  url?: string;
  alt?: string;
  caption?: string;
  title?: string;
  text: string;
  imagePosition: "left" | "right";
};

function getRecordContent(content: unknown): Record<string, unknown> {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return {};
  }

  return content as Record<string, unknown>;
}

function getOptionalString(
  content: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = content[key];

  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function renderVideoBlock(content: unknown) {
  const record = getRecordContent(content);

  const url = getOptionalString(record, "url");
  const title = getOptionalString(record, "title");
  const caption = getOptionalString(record, "caption");
  const provider = normalizeVideoProvider(
    getOptionalString(record, "provider"),
  );

  if (!url) {
    return "";
  }

  const embedUrl = getVideoEmbedUrl(url, provider);

  if (!embedUrl) {
    return `
      <p class="article-block article-video-link-block">
        <a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">
          ${escapeHtml(title ?? "Apri video")}
        </a>
      </p>
    `;
  }

  return `
    <figure class="article-block article-video-block">
      <iframe
        src="${escapeHtml(embedUrl)}"
        title="${escapeHtml(title ?? "Video embedded")}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
    </figure>
  `;
}

function renderImageBlock(content: unknown, mediaById: MediaAssetMap) {
  const record = getRecordContent(content);

  const mediaAssetId = getOptionalString(record, "mediaAssetId");
  const mediaAsset = mediaAssetId ? mediaById.get(mediaAssetId) : undefined;

  const image: ImageBlockContent = {
    mediaAssetId,
    url: mediaAsset?.url ?? getOptionalString(record, "url"),
    alt: getOptionalString(record, "alt") ?? mediaAsset?.alt ?? undefined,
    caption:
      getOptionalString(record, "caption") ?? mediaAsset?.caption ?? undefined,
  };

  if (!image.url) {
    return "";
  }

  return `
    <figure class="article-block article-image-block">
      <img
        src="${escapeHtml(image.url)}"
        alt="${escapeHtml(image.alt ?? "")}"
        loading="lazy"
        decoding="async"
      />
      ${
        image.caption
          ? `<figcaption>${escapeHtml(image.caption)}</figcaption>`
          : ""
      }
    </figure>
  `;
}

function renderImageTextBlock(content: unknown, mediaById: MediaAssetMap) {
  const record = getRecordContent(content);

  const mediaAssetId = getOptionalString(record, "mediaAssetId");
  const mediaAsset = mediaAssetId ? mediaById.get(mediaAssetId) : undefined;

  const imageText: ImageTextBlockContent = {
    mediaAssetId,
    url: mediaAsset?.url ?? getOptionalString(record, "url"),
    alt: getOptionalString(record, "alt") ?? mediaAsset?.alt ?? undefined,
    caption:
      getOptionalString(record, "caption") ?? mediaAsset?.caption ?? undefined,
    title: getOptionalString(record, "title"),
    text: getOptionalString(record, "text") ?? "",
    imagePosition:
      getOptionalString(record, "imagePosition") === "right" ? "right" : "left",
  };

  const imageMarkup = imageText.url
    ? `
      <figure class="article-image-text-block__media">
        <img
          src="${escapeHtml(imageText.url)}"
          alt="${escapeHtml(imageText.alt ?? "")}"
          loading="lazy"
          decoding="async"
        />
        ${
          imageText.caption
            ? `<figcaption>${escapeHtml(imageText.caption)}</figcaption>`
            : ""
        }
      </figure>
    `
    : "";

  const textMarkup = `
    <div class="article-image-text-block__copy">
      ${imageText.title ? `<h2>${escapeHtml(imageText.title)}</h2>` : ""}
      ${imageText.text ? `<p>${escapeHtml(imageText.text)}</p>` : ""}
    </div>
  `;

  return `
    <section class="article-block article-image-text-block article-image-text-block--${imageText.imagePosition}">
      ${
        imageText.imagePosition === "right"
          ? textMarkup + imageMarkup
          : imageMarkup + textMarkup
      }
    </section>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeDialogLine(line: string): string {
  return line
    .trim()
    .replace(/^["“”«]\s*/, "")
    .replace(/\s*["“”»]$/, "")
    .trim();
}

function isDialogLine(line: string): boolean {
  const trimmed = line.trim();

  if (trimmed.length < 2) {
    return false;
  }

  return (
    (/^".*"$/.test(trimmed) ||
      /^“.*”$/.test(trimmed) ||
      /^«.*»$/.test(trimmed)) &&
    normalizeDialogLine(trimmed).length > 0
  );
}

function getDialogLines(text: string): string[] | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  if (!lines.every(isDialogLine)) {
    return null;
  }

  return lines.map(normalizeDialogLine);
}

function renderDialogBlock(text: string) {
  const lines = getDialogLines(text);

  if (!lines) {
    return null;
  }

  return `
    <div class="article-block article-dialog-block">
      ${lines
        .map(
          (line) => `
            <p>
              <span class="article-dialog-block__mark">“</span>
              <span>${escapeHtml(line)}</span>
              <span class="article-dialog-block__mark">”</span>
            </p>
          `,
        )
        .join("")}
    </div>
  `;
}

function getStringRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function layoutClass(layout: $Enums.ArticleBlockLayout) {
  return `article-layout--${layout.toLowerCase().replaceAll("_", "-")}`;
}

function renderParagraph(block: ArticleBlockForRender) {
  const content = getStringRecord(block.content);
  const text = asString(content.text);

  if (!text) {
    return "";
  }

  return `
<section class="article-block article-block--paragraph ${layoutClass(block.layout)}">
  <p>${escapeHtml(text).replaceAll("\n", "<br />")}</p>
</section>`;
}

function renderHeading(block: ArticleBlockForRender) {
  const content = getStringRecord(block.content);
  const text = asString(content.text);

  if (!text) {
    return "";
  }

  const level = Math.min(Math.max(asNumber(content.level) ?? 2, 2), 3);

  return `
<section class="article-block article-block--heading ${layoutClass(block.layout)}">
  <h${level}>${escapeHtml(text)}</h${level}>
</section>`;
}

function renderQuote(content: unknown) {
  const record = getRecordContent(content);
  const text = getOptionalString(record, "text") ?? "";
  const attribution = getOptionalString(record, "attribution");

  if (!text) {
    return "";
  }

  const dialogBlock = renderDialogBlock(text);

  if (dialogBlock) {
    return dialogBlock;
  }

  return `
    <blockquote class="article-block article-quote-block">
      <p>${escapeHtml(text)}</p>
      ${attribution ? `<cite>${escapeHtml(attribution)}</cite>` : ""}
    </blockquote>
  `;
}

function renderVideo(block: ArticleBlockForRender) {
  const content = getStringRecord(block.content);
  const provider = asString(content.provider);
  const videoId = asString(content.videoId);
  const title = asString(content.title) ?? "Video";

  if (provider !== "YOUTUBE" || !videoId) {
    return "";
  }

  return `
<section class="article-block article-block--video ${layoutClass(block.layout)}">
  <iframe
    src="https://www.youtube-nocookie.com/embed/${escapeHtml(videoId)}"
    title="${escapeHtml(title)}"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</section>`;
}

function renderDivider(block: ArticleBlockForRender) {
  return `
<section class="article-block article-block--divider ${layoutClass(block.layout)}">
  <hr />
</section>`;
}

export function renderArticleBlocksToHtml(
  blocks: ArticleBlockForRender[],
  mediaById: MediaAssetMap = new Map(),
) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case $Enums.ArticleBlockType.HEADING:
          return renderHeading(block);

        case $Enums.ArticleBlockType.PARAGRAPH:
          return renderParagraph(block);

        case $Enums.ArticleBlockType.VIDEO:
          return renderVideoBlock(block.content);

        case $Enums.ArticleBlockType.IMAGE:
          return renderImageBlock(block.content, mediaById);

        case $Enums.ArticleBlockType.IMAGE_TEXT:
          return renderImageTextBlock(block.content, mediaById);

        case $Enums.ArticleBlockType.QUOTE:
          return renderQuote(block);

        case $Enums.ArticleBlockType.VIDEO:
          return renderVideo(block);

        case $Enums.ArticleBlockType.DIVIDER:
          return renderDivider(block);

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}
