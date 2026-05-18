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

function renderImage(block: ArticleBlockForRender, mediaById: MediaAssetMap) {
  const content = getStringRecord(block.content);
  const assetId = asString(content.assetId);

  if (!assetId) {
    return "";
  }

  const asset = mediaById.get(assetId);

  if (!asset) {
    return "";
  }

  const caption = asString(content.caption) ?? asset.caption;

  return `
<section class="article-block article-block--image ${layoutClass(block.layout)}">
  <figure>
    <img src="${escapeHtml(asset.url)}" alt="${escapeHtml(asset.alt ?? "")}" />
    ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
  </figure>
</section>`;
}

function renderImageText(
  block: ArticleBlockForRender,
  mediaById: MediaAssetMap,
) {
  const content = getStringRecord(block.content);
  const assetId = asString(content.assetId);
  const text = asString(content.text);

  if (!assetId || !text) {
    return "";
  }

  const asset = mediaById.get(assetId);

  if (!asset) {
    return "";
  }

  const title = asString(content.title);

  return `
<section class="article-block article-block--image-text ${layoutClass(block.layout)}">
  <figure>
    <img src="${escapeHtml(asset.url)}" alt="${escapeHtml(asset.alt ?? "")}" />
  </figure>
  <div>
    ${title ? `<h3>${escapeHtml(title)}</h3>` : ""}
    <p>${escapeHtml(text).replaceAll("\n", "<br />")}</p>
  </div>
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
          return renderImage(block, mediaById);

        case $Enums.ArticleBlockType.IMAGE_TEXT:
          return renderImageText(block, mediaById);

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
