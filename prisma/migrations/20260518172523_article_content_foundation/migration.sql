-- CreateEnum
CREATE TYPE "ArticleKind" AS ENUM ('DIARY_ENTRY', 'BLOG_POST', 'BROADCAST', 'PRESS_NOTE', 'LORE');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleBlockType" AS ENUM ('PARAGRAPH', 'HEADING', 'IMAGE', 'VIDEO', 'GALLERY', 'QUOTE', 'CALLOUT', 'AUDIO', 'EMBED', 'DIVIDER', 'CTA', 'RELATED_CONTENT');

-- CreateEnum
CREATE TYPE "ArticleBlockLayout" AS ENUM ('DEFAULT', 'INLINE', 'WIDE', 'FULL_BLEED', 'GRID_2', 'GRID_3', 'CAROUSEL', 'SPLIT');

-- CreateEnum
CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'EMBED');

-- CreateEnum
CREATE TYPE "MediaAssetProvider" AS ENUM ('LOCAL', 'R2', 'CLOUDINARY', 'YOUTUBE', 'VIMEO', 'SPOTIFY', 'EXTERNAL');

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "kind" "ArticleKind" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "coverAssetId" TEXT,
    "renderedHtml" TEXT,
    "renderedAt" TIMESTAMP(3),
    "contentVersion" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleContentBlock" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "type" "ArticleBlockType" NOT NULL,
    "layout" "ArticleBlockLayout" NOT NULL DEFAULT 'DEFAULT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "type" "MediaAssetType" NOT NULL,
    "provider" "MediaAssetProvider" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_kind_status_publishedAt_idx" ON "Article"("kind", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "ArticleContentBlock_articleId_order_idx" ON "ArticleContentBlock"("articleId", "order");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_coverAssetId_fkey" FOREIGN KEY ("coverAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleContentBlock" ADD CONSTRAINT "ArticleContentBlock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
