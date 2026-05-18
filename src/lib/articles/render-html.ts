import { $Enums, type MediaAsset } from "@/generated/prisma";

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

function renderImageBlock(content: unknown) {
  const record = getRecordContent(content);

  const image: ImageBlockContent = {
    mediaAssetId: getOptionalString(record, "mediaAssetId"),
    url: getOptionalString(record, "url"),
    alt: getOptionalString(record, "alt"),
    caption: getOptionalString(record, "caption"),
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

function renderImageTextBlock(content: unknown) {
  const record = getRecordContent(content);

  const imageText: ImageTextBlockContent = {
    mediaAssetId: getOptionalString(record, "mediaAssetId"),
    url: getOptionalString(record, "url"),
    alt: getOptionalString(record, "alt"),
    caption: getOptionalString(record, "caption"),
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
      ${imageText.imagePosition === "right" ? textMarkup + imageMarkup : imageMarkup + textMarkup}
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

function renderQuote(block: ArticleBlockForRender) {
  const content = getStringRecord(block.content);
  const text = asString(content.text);

  if (!text) {
    return "";
  }

  const cite = asString(content.cite);

  return `
<section class="article-block article-block--quote ${layoutClass(block.layout)}">
  <blockquote>
    <p>${escapeHtml(text)}</p>
    ${cite ? `<cite>${escapeHtml(cite)}</cite>` : ""}
  </blockquote>
</section>`;
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

        case $Enums.ArticleBlockType.IMAGE:
          return renderImageBlock(block.content);

        case $Enums.ArticleBlockType.IMAGE_TEXT:
          return renderImageTextBlock(block.content);

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
