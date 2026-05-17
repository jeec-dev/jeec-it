/*
  Warnings:

  - A unique constraint covering the columns `[sourceId,entityType,externalId,artistId]` on the table `ExternalIdentifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceId,entityType,externalId,releaseId]` on the table `ExternalIdentifier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sourceId,entityType,externalId,trackId]` on the table `ExternalIdentifier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ExternalIdentifier_sourceId_entityType_externalId_key";

-- CreateIndex
CREATE INDEX "ExternalIdentifier_sourceId_entityType_externalId_idx" ON "ExternalIdentifier"("sourceId", "entityType", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentifier_sourceId_entityType_externalId_artistId_key" ON "ExternalIdentifier"("sourceId", "entityType", "externalId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentifier_sourceId_entityType_externalId_releaseId_key" ON "ExternalIdentifier"("sourceId", "entityType", "externalId", "releaseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentifier_sourceId_entityType_externalId_trackId_key" ON "ExternalIdentifier"("sourceId", "entityType", "externalId", "trackId");
