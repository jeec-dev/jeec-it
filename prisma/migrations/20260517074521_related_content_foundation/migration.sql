-- CreateEnum
CREATE TYPE "ContentEntityType" AS ENUM ('MUSIC', 'ARTICLE', 'VIDEO', 'EXPERIENCE', 'COMMERCE', 'EVENT', 'PAGE', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ContentEntityStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentRelationType" AS ENUM ('RELATED', 'CONTAINS', 'ABOUT', 'FEATURES', 'VIDEO', 'LORE', 'ARTICLE', 'BROADCAST', 'MERCH', 'EVENT', 'STORE', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ContentRelationStatus" AS ENUM ('SUGGESTED', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ContentRelationSource" AS ENUM ('SYSTEM', 'ADMIN', 'SEED', 'IMPORT');

-- CreateEnum
CREATE TYPE "RelatedContentSourceMode" AS ENUM ('MANUAL', 'AUTO', 'HYBRID');

-- CreateEnum
CREATE TYPE "RelatedContentLayout" AS ENUM ('FEATURED', 'RAIL', 'GRID', 'COMPACT');

-- CreateTable
CREATE TABLE "ContentEntityKindDefinition" (
    "type" "ContentEntityType" NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentEntityKindDefinition_pkey" PRIMARY KEY ("type","key")
);

-- CreateTable
CREATE TABLE "ContentEntity" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "ContentEntityType" NOT NULL,
    "kindKey" TEXT NOT NULL,
    "targetId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "href" TEXT,
    "imageUrl" TEXT,
    "status" "ContentEntityStatus" NOT NULL DEFAULT 'DRAFT',
    "isPreview" BOOLEAN NOT NULL DEFAULT false,
    "availableAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRelation" (
    "id" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "type" "ContentRelationType" NOT NULL,
    "status" "ContentRelationStatus" NOT NULL DEFAULT 'SUGGESTED',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "confidence" DOUBLE PRECISION,
    "source" "ContentRelationSource" NOT NULL DEFAULT 'SYSTEM',
    "reason" TEXT,
    "metadata" JSONB,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedContent" (
    "id" TEXT NOT NULL,
    "ownerEntityId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "sourceMode" "RelatedContentSourceMode" NOT NULL DEFAULT 'AUTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedContentSection" (
    "id" TEXT NOT NULL,
    "relatedContentId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "layout" "RelatedContentLayout" NOT NULL DEFAULT 'RAIL',
    "relationType" "ContentRelationType",
    "targetType" "ContentEntityType",
    "targetKindKey" TEXT,
    "maxItems" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatedContentSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedContentItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "titleOverride" TEXT,
    "descriptionOverride" TEXT,
    "eyebrowOverride" TEXT,
    "ctaLabelOverride" TEXT,
    "hrefOverride" TEXT,
    "imageUrlOverride" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatedContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentEntityKindDefinition_type_idx" ON "ContentEntityKindDefinition"("type");

-- CreateIndex
CREATE INDEX "ContentEntityKindDefinition_isEnabled_idx" ON "ContentEntityKindDefinition"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntity_key_key" ON "ContentEntity"("key");

-- CreateIndex
CREATE INDEX "ContentEntity_type_idx" ON "ContentEntity"("type");

-- CreateIndex
CREATE INDEX "ContentEntity_kindKey_idx" ON "ContentEntity"("kindKey");

-- CreateIndex
CREATE INDEX "ContentEntity_type_kindKey_idx" ON "ContentEntity"("type", "kindKey");

-- CreateIndex
CREATE INDEX "ContentEntity_targetId_idx" ON "ContentEntity"("targetId");

-- CreateIndex
CREATE INDEX "ContentEntity_status_idx" ON "ContentEntity"("status");

-- CreateIndex
CREATE INDEX "ContentEntity_isPreview_idx" ON "ContentEntity"("isPreview");

-- CreateIndex
CREATE INDEX "ContentEntity_availableAt_idx" ON "ContentEntity"("availableAt");

-- CreateIndex
CREATE INDEX "ContentRelation_sourceEntityId_idx" ON "ContentRelation"("sourceEntityId");

-- CreateIndex
CREATE INDEX "ContentRelation_targetEntityId_idx" ON "ContentRelation"("targetEntityId");

-- CreateIndex
CREATE INDEX "ContentRelation_type_idx" ON "ContentRelation"("type");

-- CreateIndex
CREATE INDEX "ContentRelation_status_idx" ON "ContentRelation"("status");

-- CreateIndex
CREATE INDEX "ContentRelation_isFeatured_idx" ON "ContentRelation"("isFeatured");

-- CreateIndex
CREATE INDEX "ContentRelation_priority_idx" ON "ContentRelation"("priority");

-- CreateIndex
CREATE INDEX "ContentRelation_isPublic_idx" ON "ContentRelation"("isPublic");

-- CreateIndex
CREATE INDEX "ContentRelation_confidence_idx" ON "ContentRelation"("confidence");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRelation_sourceEntityId_targetEntityId_type_key" ON "ContentRelation"("sourceEntityId", "targetEntityId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedContent_ownerEntityId_key" ON "RelatedContent"("ownerEntityId");

-- CreateIndex
CREATE INDEX "RelatedContentSection_relatedContentId_order_idx" ON "RelatedContentSection"("relatedContentId", "order");

-- CreateIndex
CREATE INDEX "RelatedContentSection_relationType_idx" ON "RelatedContentSection"("relationType");

-- CreateIndex
CREATE INDEX "RelatedContentSection_targetType_idx" ON "RelatedContentSection"("targetType");

-- CreateIndex
CREATE INDEX "RelatedContentSection_targetKindKey_idx" ON "RelatedContentSection"("targetKindKey");

-- CreateIndex
CREATE INDEX "RelatedContentSection_priority_idx" ON "RelatedContentSection"("priority");

-- CreateIndex
CREATE INDEX "RelatedContentSection_isPublic_idx" ON "RelatedContentSection"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedContentSection_relatedContentId_key_key" ON "RelatedContentSection"("relatedContentId", "key");

-- CreateIndex
CREATE INDEX "RelatedContentItem_sectionId_order_idx" ON "RelatedContentItem"("sectionId", "order");

-- CreateIndex
CREATE INDEX "RelatedContentItem_targetEntityId_idx" ON "RelatedContentItem"("targetEntityId");

-- CreateIndex
CREATE INDEX "RelatedContentItem_isPinned_idx" ON "RelatedContentItem"("isPinned");

-- CreateIndex
CREATE INDEX "RelatedContentItem_isFeatured_idx" ON "RelatedContentItem"("isFeatured");

-- CreateIndex
CREATE INDEX "RelatedContentItem_priority_idx" ON "RelatedContentItem"("priority");

-- CreateIndex
CREATE INDEX "RelatedContentItem_isPublic_idx" ON "RelatedContentItem"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "RelatedContentItem_sectionId_key_key" ON "RelatedContentItem"("sectionId", "key");

-- AddForeignKey
ALTER TABLE "ContentEntity" ADD CONSTRAINT "ContentEntity_type_kindKey_fkey" FOREIGN KEY ("type", "kindKey") REFERENCES "ContentEntityKindDefinition"("type", "key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelation" ADD CONSTRAINT "ContentRelation_sourceEntityId_fkey" FOREIGN KEY ("sourceEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentRelation" ADD CONSTRAINT "ContentRelation_targetEntityId_fkey" FOREIGN KEY ("targetEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedContent" ADD CONSTRAINT "RelatedContent_ownerEntityId_fkey" FOREIGN KEY ("ownerEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedContentSection" ADD CONSTRAINT "RelatedContentSection_relatedContentId_fkey" FOREIGN KEY ("relatedContentId") REFERENCES "RelatedContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedContentItem" ADD CONSTRAINT "RelatedContentItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "RelatedContentSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedContentItem" ADD CONSTRAINT "RelatedContentItem_targetEntityId_fkey" FOREIGN KEY ("targetEntityId") REFERENCES "ContentEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
