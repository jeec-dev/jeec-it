-- AlterTable
ALTER TABLE "ContentEntity" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ContentEntity_publishedAt_idx" ON "ContentEntity"("publishedAt");
