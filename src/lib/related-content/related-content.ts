import { db } from "@/lib/db";
import type { ContentEntityType } from "@/generated/prisma";
import { sortAndDedupeRelatedCandidates } from "./sorting";
import type {
  RelatedCandidate,
  RelatedContentBlockView,
  RelatedContentItemView,
  RelatedTargetEntity,
} from "./types";

type SectionRecord = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  layout: RelatedContentBlockView["sections"][number]["layout"];
  relationType: string | null;
  targetType: ContentEntityType | null;
  targetKindKey: string | null;
  maxItems: number | null;
};

function isWithinDateWindow(
  startsAt: Date | null | undefined,
  endsAt: Date | null | undefined,
  now: Date,
) {
  if (startsAt && startsAt > now) {
    return false;
  }

  if (endsAt && endsAt < now) {
    return false;
  }

  return true;
}

function isPublicTargetEntity(
  entity: RelatedTargetEntity & {
    status?: string;
    availableAt?: Date | null;
  },
  now: Date,
) {
  if (entity.status !== "PUBLISHED") {
    return false;
  }

  if (entity.availableAt && entity.availableAt > now) {
    return false;
  }

  return true;
}

function matchesSectionTarget(
  entity: RelatedTargetEntity,
  section: SectionRecord,
) {
  if (section.targetType && entity.type !== section.targetType) {
    return false;
  }

  if (section.targetKindKey && entity.kindKey !== section.targetKindKey) {
    return false;
  }

  return true;
}

function getDefaultEyebrow(entity: RelatedTargetEntity) {
  if (entity.type === "MUSIC" && entity.kindKey === "TRACK") {
    return "Traccia";
  }

  if (entity.type === "MUSIC" && entity.kindKey === "RELEASE") {
    return "Release";
  }

  if (entity.type === "EXPERIENCE") {
    return "Esperienza";
  }

  if (entity.type === "ARTICLE") {
    return "Articolo";
  }

  if (entity.type === "VIDEO") {
    return "Video";
  }

  return entity.type;
}

function toViewItem(candidate: RelatedCandidate): RelatedContentItemView {
  const target = candidate.targetEntity;
  const href = candidate.overrides?.href ?? target.href;

  return {
    id: target.id,
    source: candidate.source,
    type: target.type,
    kindKey: target.kindKey,
    title: candidate.overrides?.title ?? target.title,
    description: candidate.overrides?.description ?? target.description,
    eyebrow: candidate.overrides?.eyebrow ?? getDefaultEyebrow(target),
    ctaLabel:
      candidate.overrides?.ctaLabel ??
      (href?.startsWith("http://") || href?.startsWith("https://")
        ? "Apri link"
        : "Esplora"),
    href,
    imageUrl: candidate.overrides?.imageUrl ?? target.imageUrl,
    isPinned: candidate.isPinned,
    isFeatured: candidate.isFeatured,
    publishedAt: target.publishedAt,
  };
}

export async function getRelatedContentForEntity(
  ownerEntityKey: string,
): Promise<RelatedContentBlockView | null> {
  const now = new Date();

  const ownerEntity = await db.contentEntity.findUnique({
    where: { key: ownerEntityKey },
    select: { id: true, key: true },
  });

  if (!ownerEntity) {
    return null;
  }

  const block = await db.relatedContent.findUnique({
    where: { ownerEntityId: ownerEntity.id },
    select: {
      id: true,
      title: true,
      description: true,
      sourceMode: true,
      sections: {
        where: { isPublic: true },
        orderBy: [{ order: "asc" }, { priority: "desc" }],
        select: {
          id: true,
          key: true,
          title: true,
          description: true,
          layout: true,
          relationType: true,
          targetType: true,
          targetKindKey: true,
          maxItems: true,
        },
      },
    },
  });

  if (!block) {
    return null;
  }

  const sections = [];

  for (const section of block.sections) {
    const candidates: RelatedCandidate[] = [];

    if (block.sourceMode === "MANUAL" || block.sourceMode === "HYBRID") {
      const manualItems = await db.relatedContentItem.findMany({
        where: {
          sectionId: section.id,
          isPublic: true,
        },
        include: {
          targetEntity: true,
        },
      });

      for (const item of manualItems) {
        if (!isWithinDateWindow(item.startsAt, item.endsAt, now)) {
          continue;
        }

        if (!isPublicTargetEntity(item.targetEntity, now)) {
          continue;
        }

        if (!matchesSectionTarget(item.targetEntity, section)) {
          continue;
        }

        candidates.push({
          source: "manual",
          sectionId: section.id,
          targetEntityId: item.targetEntityId,
          targetEntity: item.targetEntity,
          isPinned: item.isPinned,
          isFeatured: item.isFeatured,
          priority: item.priority,
          overrides: {
            title: item.titleOverride,
            description: item.descriptionOverride,
            eyebrow: item.eyebrowOverride,
            ctaLabel: item.ctaLabelOverride,
            href: item.hrefOverride,
            imageUrl: item.imageUrlOverride,
          },
        });
      }
    }

    if (block.sourceMode === "AUTO" || block.sourceMode === "HYBRID") {
      const relations = await db.contentRelation.findMany({
        where: {
          sourceEntityId: ownerEntity.id,
          status: "APPROVED",
          isPublic: true,
          ...(section.relationType ? { type: section.relationType } : {}),
        },
        include: {
          targetEntity: true,
        },
      });

      for (const relation of relations) {
        if (!isWithinDateWindow(relation.startsAt, relation.endsAt, now)) {
          continue;
        }

        if (!isPublicTargetEntity(relation.targetEntity, now)) {
          continue;
        }

        if (!matchesSectionTarget(relation.targetEntity, section)) {
          continue;
        }

        candidates.push({
          source: "auto",
          sectionId: section.id,
          targetEntityId: relation.targetEntityId,
          targetEntity: relation.targetEntity,
          isPinned: false,
          isFeatured: relation.isFeatured,
          priority: relation.priority,
        });
      }
    }

    const items = sortAndDedupeRelatedCandidates(
      candidates,
      section.maxItems,
    ).map(toViewItem);

    if (items.length === 0) {
      continue;
    }

    sections.push({
      id: section.id,
      key: section.key,
      title: section.title,
      description: section.description,
      layout: section.layout,
      items,
    });
  }

  if (sections.length === 0) {
    return null;
  }

  return {
    id: block.id,
    ownerEntityKey: ownerEntity.key,
    title: block.title,
    description: block.description,
    sourceMode: block.sourceMode,
    sections,
  };
}

export async function getRelatedContentForReleaseSlug(releaseSlug: string) {
  const release = await db.release.findUnique({
    where: {
      slug: releaseSlug,
    },
    select: {
      id: true,
    },
  });

  if (!release) {
    return null;
  }

  return getRelatedContentForEntity(`music:release:${release.id}`);
}
