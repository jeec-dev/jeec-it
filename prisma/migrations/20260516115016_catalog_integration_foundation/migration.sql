-- CreateEnum
CREATE TYPE "ExternalEntityType" AS ENUM ('ARTIST', 'RELEASE', 'TRACK', 'VIDEO', 'EVENT', 'VENUE', 'PLAYLIST');

-- CreateEnum
CREATE TYPE "ExternalLinkType" AS ENUM ('STREAMING', 'VIDEO', 'LYRICS', 'TICKETS', 'SOCIAL', 'PRESS', 'STORE', 'OTHER');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "SyncIssueSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "SyncIssueStatus" AS ENUM ('OPEN', 'ACCEPTED_REMOTE', 'KEPT_LOCAL', 'IGNORED', 'RESOLVED');

-- CreateTable
CREATE TABLE "ExternalIdentifier" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "entityType" "ExternalEntityType" NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalUrl" TEXT,
    "artistId" TEXT,
    "releaseId" TEXT,
    "trackId" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalLink" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "type" "ExternalLinkType" NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "releaseId" TEXT,
    "trackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "summary" JSONB,
    "error" TEXT,

    CONSTRAINT "SyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiSnapshot" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "syncRunId" TEXT,
    "entityType" "ExternalEntityType" NOT NULL,
    "externalId" TEXT,
    "payload" JSONB NOT NULL,
    "payloadHash" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncIssue" (
    "id" TEXT NOT NULL,
    "syncRunId" TEXT,
    "sourceId" TEXT,
    "entityType" "ExternalEntityType" NOT NULL,
    "entityId" TEXT,
    "fieldName" TEXT,
    "localValue" TEXT,
    "remoteValue" TEXT,
    "severity" "SyncIssueSeverity" NOT NULL DEFAULT 'INFO',
    "status" "SyncIssueStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "SyncIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExternalIdentifier_entityType_idx" ON "ExternalIdentifier"("entityType");

-- CreateIndex
CREATE INDEX "ExternalIdentifier_artistId_idx" ON "ExternalIdentifier"("artistId");

-- CreateIndex
CREATE INDEX "ExternalIdentifier_releaseId_idx" ON "ExternalIdentifier"("releaseId");

-- CreateIndex
CREATE INDEX "ExternalIdentifier_trackId_idx" ON "ExternalIdentifier"("trackId");

-- CreateIndex
CREATE INDEX "ExternalIdentifier_verificationStatus_idx" ON "ExternalIdentifier"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentifier_sourceId_entityType_externalId_key" ON "ExternalIdentifier"("sourceId", "entityType", "externalId");

-- CreateIndex
CREATE INDEX "ExternalLink_sourceId_idx" ON "ExternalLink"("sourceId");

-- CreateIndex
CREATE INDEX "ExternalLink_type_idx" ON "ExternalLink"("type");

-- CreateIndex
CREATE INDEX "ExternalLink_releaseId_idx" ON "ExternalLink"("releaseId");

-- CreateIndex
CREATE INDEX "ExternalLink_trackId_idx" ON "ExternalLink"("trackId");

-- CreateIndex
CREATE INDEX "ExternalLink_isPublic_idx" ON "ExternalLink"("isPublic");

-- CreateIndex
CREATE INDEX "SyncRun_sourceId_idx" ON "SyncRun"("sourceId");

-- CreateIndex
CREATE INDEX "SyncRun_status_idx" ON "SyncRun"("status");

-- CreateIndex
CREATE INDEX "SyncRun_startedAt_idx" ON "SyncRun"("startedAt");

-- CreateIndex
CREATE INDEX "ApiSnapshot_sourceId_idx" ON "ApiSnapshot"("sourceId");

-- CreateIndex
CREATE INDEX "ApiSnapshot_syncRunId_idx" ON "ApiSnapshot"("syncRunId");

-- CreateIndex
CREATE INDEX "ApiSnapshot_entityType_idx" ON "ApiSnapshot"("entityType");

-- CreateIndex
CREATE INDEX "ApiSnapshot_externalId_idx" ON "ApiSnapshot"("externalId");

-- CreateIndex
CREATE INDEX "ApiSnapshot_fetchedAt_idx" ON "ApiSnapshot"("fetchedAt");

-- CreateIndex
CREATE INDEX "SyncIssue_syncRunId_idx" ON "SyncIssue"("syncRunId");

-- CreateIndex
CREATE INDEX "SyncIssue_sourceId_idx" ON "SyncIssue"("sourceId");

-- CreateIndex
CREATE INDEX "SyncIssue_entityType_idx" ON "SyncIssue"("entityType");

-- CreateIndex
CREATE INDEX "SyncIssue_entityId_idx" ON "SyncIssue"("entityId");

-- CreateIndex
CREATE INDEX "SyncIssue_severity_idx" ON "SyncIssue"("severity");

-- CreateIndex
CREATE INDEX "SyncIssue_status_idx" ON "SyncIssue"("status");

-- AddForeignKey
ALTER TABLE "ExternalIdentifier" ADD CONSTRAINT "ExternalIdentifier_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ExternalSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentifier" ADD CONSTRAINT "ExternalIdentifier_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentifier" ADD CONSTRAINT "ExternalIdentifier_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentifier" ADD CONSTRAINT "ExternalIdentifier_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLink" ADD CONSTRAINT "ExternalLink_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ExternalSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLink" ADD CONSTRAINT "ExternalLink_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLink" ADD CONSTRAINT "ExternalLink_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncRun" ADD CONSTRAINT "SyncRun_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ExternalSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSnapshot" ADD CONSTRAINT "ApiSnapshot_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ExternalSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiSnapshot" ADD CONSTRAINT "ApiSnapshot_syncRunId_fkey" FOREIGN KEY ("syncRunId") REFERENCES "SyncRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncIssue" ADD CONSTRAINT "SyncIssue_syncRunId_fkey" FOREIGN KEY ("syncRunId") REFERENCES "SyncRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
