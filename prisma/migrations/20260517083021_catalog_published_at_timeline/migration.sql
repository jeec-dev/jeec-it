-- AlterTable
ALTER TABLE "Release" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Track" ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Release_publishedAt_idx" ON "Release"("publishedAt");

-- CreateIndex
CREATE INDEX "Track_publishedAt_idx" ON "Track"("publishedAt");
