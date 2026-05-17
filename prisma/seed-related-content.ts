import { $Enums } from "../src/generated/prisma";
import { db } from "../src/lib/db";

const KIND_DEFINITIONS = [
  { type: $Enums.ContentEntityType.MUSIC, key: "RELEASE", label: "Release" },
  { type: $Enums.ContentEntityType.MUSIC, key: "TRACK", label: "Track" },
  {
    type: $Enums.ContentEntityType.EXPERIENCE,
    key: "INTERACTIVE_EXPERIENCE",
    label: "Interactive Experience",
  },
];

async function upsertContentRelation(input: {
  sourceEntityId: string;
  targetEntityId: string;
  type: $Enums.ContentRelationType;
  isFeatured?: boolean;
  priority?: number;
  order?: number;
  reason?: string;
}) {
  const existing = await db.contentRelation.findFirst({
    where: {
      sourceEntityId: input.sourceEntityId,
      targetEntityId: input.targetEntityId,
      type: input.type,
    },
    select: { id: true },
  });

  const data = {
    sourceEntityId: input.sourceEntityId,
    targetEntityId: input.targetEntityId,
    type: input.type,
    status: $Enums.ContentRelationStatus.APPROVED,
    source: $Enums.ContentRelationSource.SEED,
    isPublic: true,
    isFeatured: input.isFeatured ?? false,
    priority: input.priority ?? 0,
    order: input.order ?? 0,
    reason: input.reason,
  };

  if (existing) {
    return db.contentRelation.update({
      where: { id: existing.id },
      data,
    });
  }

  return db.contentRelation.create({ data });
}

async function upsertRelatedContentSection(input: {
  relatedContentId: string;
  key: string;
  title: string;
  description?: string;
  layout: $Enums.RelatedContentLayout;
  relationType?: $Enums.ContentRelationType;
  targetType?: $Enums.ContentEntityType;
  targetKindKey?: string;
  maxItems?: number;
  priority?: number;
  order?: number;
}) {
  const existing = await db.relatedContentSection.findFirst({
    where: {
      relatedContentId: input.relatedContentId,
      key: input.key,
    },
    select: { id: true },
  });

  const data = {
    relatedContentId: input.relatedContentId,
    key: input.key,
    title: input.title,
    description: input.description,
    layout: input.layout,
    relationType: input.relationType,
    targetType: input.targetType,
    targetKindKey: input.targetKindKey,
    maxItems: input.maxItems,
    priority: input.priority ?? 0,
    order: input.order ?? 0,
    isPublic: true,
  };

  if (existing) {
    return db.relatedContentSection.update({
      where: { id: existing.id },
      data,
    });
  }

  return db.relatedContentSection.create({ data });
}

async function seedTrackRelatedContentBlocks() {
  const releases = await db.release.findMany({
    include: {
      tracks: {
        orderBy: { position: "asc" },
      },
    },
    orderBy: { publishedAt: "desc" },
  });

  for (const release of releases) {
    const releaseEntity = await db.contentEntity.findUnique({
      where: { key: `music:release:${release.id}` },
      select: { id: true, title: true },
    });

    if (!releaseEntity) {
      continue;
    }

    const trackEntities = await db.contentEntity.findMany({
      where: {
        type: $Enums.ContentEntityType.MUSIC,
        kindKey: "TRACK",
        targetId: {
          in: release.tracks.map((track) => track.id),
        },
      },
      select: {
        id: true,
        targetId: true,
      },
    });

    const trackEntityByTrackId = new Map(
      trackEntities.map((entity) => [entity.targetId, entity]),
    );

    for (
      let trackIndex = 0;
      trackIndex < release.tracks.length;
      trackIndex += 1
    ) {
      const track = release.tracks[trackIndex];
      const trackEntity = trackEntityByTrackId.get(track.id);

      if (!trackEntity) {
        continue;
      }

      const block = await db.relatedContent.upsert({
        where: {
          ownerEntityId: trackEntity.id,
        },
        update: {
          title: `Nel mondo di ${track.title}`,
          description:
            "Contenuti collegati alla traccia, alla release e al percorso musicale.",
          sourceMode: $Enums.RelatedContentSourceMode.AUTO,
        },
        create: {
          ownerEntityId: trackEntity.id,
          title: `Nel mondo di ${track.title}`,
          description:
            "Contenuti collegati alla traccia, alla release e al percorso musicale.",
          sourceMode: $Enums.RelatedContentSourceMode.AUTO,
        },
      });

      await upsertContentRelation({
        sourceEntityId: trackEntity.id,
        targetEntityId: releaseEntity.id,
        type: $Enums.ContentRelationType.RELATED,
        priority: 80,
        order: 10,
        reason: `La traccia appartiene alla release ${release.title}.`,
      });

      await upsertRelatedContentSection({
        relatedContentId: block.id,
        key: "parent-release",
        title: "Release di appartenenza",
        description: "Il progetto discografico che contiene questa traccia.",
        layout: $Enums.RelatedContentLayout.COMPACT,
        relationType: $Enums.ContentRelationType.RELATED,
        targetType: $Enums.ContentEntityType.MUSIC,
        targetKindKey: "RELEASE",
        maxItems: 1,
        priority: 90,
        order: 10,
      });

      await upsertRelatedContentSection({
        relatedContentId: block.id,
        key: "same-release-tracks",
        title: "Altre tracce della stessa release",
        description: "Altri capitoli dello stesso percorso musicale.",
        layout: $Enums.RelatedContentLayout.RAIL,
        relationType: $Enums.ContentRelationType.RELATED,
        targetType: $Enums.ContentEntityType.MUSIC,
        targetKindKey: "TRACK",
        maxItems: 6,
        priority: 70,
        order: 20,
      });

      for (
        let siblingIndex = 0;
        siblingIndex < release.tracks.length;
        siblingIndex += 1
      ) {
        const siblingTrack = release.tracks[siblingIndex];

        if (siblingTrack.id === track.id) {
          continue;
        }

        const siblingEntity = trackEntityByTrackId.get(siblingTrack.id);

        if (!siblingEntity) {
          continue;
        }

        const trackPosition = track.position ?? trackIndex + 1;
        const siblingPosition = siblingTrack.position ?? siblingIndex + 1;

        await upsertContentRelation({
          sourceEntityId: trackEntity.id,
          targetEntityId: siblingEntity.id,
          type: $Enums.ContentRelationType.RELATED,
          priority: Math.max(0, 50 - Math.abs(trackPosition - siblingPosition)),
          order: siblingPosition,
          reason: `Traccia collegata perché appartiene alla stessa release: ${release.title}.`,
        });
      }
    }
  }
}

async function seedKindDefinitions() {
  for (const kind of KIND_DEFINITIONS) {
    await db.contentEntityKindDefinition.upsert({
      where: {
        type_key: {
          type: kind.type,
          key: kind.key,
        },
      },
      update: {
        label: kind.label,
        isEnabled: true,
      },
      create: {
        type: kind.type,
        key: kind.key,
        label: kind.label,
        isEnabled: true,
      },
    });
  }
}

async function backfillReleasesAndTracks() {
  const releases = await db.release.findMany({
    include: {
      tracks: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  for (const release of releases) {
    const releaseEntity = await db.contentEntity.upsert({
      where: {
        key: `music:release:${release.id}`,
      },
      update: {
        title: release.title,
        description: release.description,
        href: `/musica/${release.slug}`,
        status: $Enums.ContentEntityStatus.PUBLISHED,
        publishedAt: release.publishedAt,
      },
      create: {
        key: `music:release:${release.id}`,
        type: $Enums.ContentEntityType.MUSIC,
        kindKey: "RELEASE",
        targetId: release.id,
        title: release.title,
        description: release.description,
        href: `/musica/${release.slug}`,
        status: $Enums.ContentEntityStatus.PUBLISHED,
        publishedAt: release.publishedAt,
        metadata: {
          slug: release.slug,
          releaseType: release.type,
        },
      },
    });

    for (const track of release.tracks) {
      const trackPublishedAt = track.publishedAt ?? release.publishedAt;

      const trackEntity = await db.contentEntity.upsert({
        where: {
          key: `music:track:${track.id}`,
        },
        update: {
          title: track.title,
          href: `/musica/${release.slug}/${track.slug}`,
          status: $Enums.ContentEntityStatus.PUBLISHED,
          publishedAt: trackPublishedAt,
        },
        create: {
          key: `music:track:${track.id}`,
          type: $Enums.ContentEntityType.MUSIC,
          kindKey: "TRACK",
          targetId: track.id,
          title: track.title,
          href: `/musica/${release.slug}/${track.slug}`,
          status: $Enums.ContentEntityStatus.PUBLISHED,
          publishedAt: trackPublishedAt,
          metadata: {
            slug: track.slug,
            releaseSlug: release.slug,
            releaseId: release.id,
          },
        },
      });

      await db.contentRelation.upsert({
        where: {
          sourceEntityId_targetEntityId_type: {
            sourceEntityId: releaseEntity.id,
            targetEntityId: trackEntity.id,
            type: $Enums.ContentRelationType.CONTAINS,
          },
        },
        update: {
          status: $Enums.ContentRelationStatus.APPROVED,
          isPublic: true,
          source: $Enums.ContentRelationSource.SEED,
        },
        create: {
          sourceEntityId: releaseEntity.id,
          targetEntityId: trackEntity.id,
          type: $Enums.ContentRelationType.CONTAINS,
          status: $Enums.ContentRelationStatus.APPROVED,
          isPublic: true,
          source: $Enums.ContentRelationSource.SEED,
          reason: "Backfill automatico: la release contiene questa traccia.",
        },
      });
    }
  }
}

async function seedNewInteractiveExperience() {
  const newRelease = await db.release.findFirst({
    where: {
      slug: "new-tutto-quello-che-non-ti-ho-detto",
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  if (!newRelease) {
    console.warn(
      "Release NEW deluxe non trovata. Skip esperienza interattiva.",
    );
    return;
  }

  const newReleaseEntity = await db.contentEntity.findUnique({
    where: {
      key: `music:release:${newRelease.id}`,
    },
  });

  if (!newReleaseEntity) {
    console.warn("ContentEntity della release NEW non trovata. Skip.");
    return;
  }

  const experienceEntity = await db.contentEntity.upsert({
    where: {
      key: "experience:new-interactive-cover",
    },
    update: {
      title: "Esperienza interattiva NEW",
      description:
        "Esplora la cover di NEW, scopri gli elementi nascosti e sblocca l’archivio digitale.",
      href: "/",
      status: $Enums.ContentEntityStatus.PUBLISHED,
      publishedAt: newRelease.publishedAt,
      isPreview: false,
    },
    create: {
      key: "experience:new-interactive-cover",
      type: $Enums.ContentEntityType.EXPERIENCE,
      kindKey: "INTERACTIVE_EXPERIENCE",
      title: "Esperienza interattiva NEW",
      description:
        "Esplora la cover di NEW, scopri gli elementi nascosti e sblocca l’archivio digitale.",
      href: "/",
      status: $Enums.ContentEntityStatus.PUBLISHED,
      publishedAt: newRelease.publishedAt,
      isPreview: false,
      metadata: {
        context: "home_arcade",
        releaseSlug: newRelease.slug,
      },
    },
  });

  await db.contentRelation.upsert({
    where: {
      sourceEntityId_targetEntityId_type: {
        sourceEntityId: newReleaseEntity.id,
        targetEntityId: experienceEntity.id,
        type: $Enums.ContentRelationType.FEATURES,
      },
    },
    update: {
      status: $Enums.ContentRelationStatus.APPROVED,
      isPublic: true,
      isFeatured: true,
      priority: 100,
      source: $Enums.ContentRelationSource.SEED,
    },
    create: {
      sourceEntityId: newReleaseEntity.id,
      targetEntityId: experienceEntity.id,
      type: $Enums.ContentRelationType.FEATURES,
      status: $Enums.ContentRelationStatus.APPROVED,
      isPublic: true,
      isFeatured: true,
      priority: 100,
      source: $Enums.ContentRelationSource.SEED,
      reason: "Esperienza interattiva ufficiale collegata alla release NEW.",
    },
  });

  const relatedContent = await db.relatedContent.upsert({
    where: {
      ownerEntityId: newReleaseEntity.id,
    },
    update: {
      title: "Dentro l’universo di NEW",
      sourceMode: $Enums.RelatedContentSourceMode.HYBRID,
    },
    create: {
      ownerEntityId: newReleaseEntity.id,
      title: "Dentro l’universo di NEW",
      description:
        "Esperienze, video, lore e contenuti collegati alla release.",
      sourceMode: $Enums.RelatedContentSourceMode.HYBRID,
    },
  });

  await db.relatedContentSection.upsert({
    where: {
      relatedContentId_key: {
        relatedContentId: relatedContent.id,
        key: "featured-experience",
      },
    },
    update: {
      title: "Esperienza speciale",
      layout: $Enums.RelatedContentLayout.FEATURED,
      relationType: $Enums.ContentRelationType.FEATURES,
      targetType: $Enums.ContentEntityType.EXPERIENCE,
      targetKindKey: "INTERACTIVE_EXPERIENCE",
      isPublic: true,
      priority: 100,
      order: 0,
    },
    create: {
      relatedContentId: relatedContent.id,
      key: "featured-experience",
      title: "Esperienza speciale",
      description: "Il contenuto interattivo principale legato a NEW.",
      layout: $Enums.RelatedContentLayout.FEATURED,
      relationType: $Enums.ContentRelationType.FEATURES,
      targetType: $Enums.ContentEntityType.EXPERIENCE,
      targetKindKey: "INTERACTIVE_EXPERIENCE",
      isPublic: true,
      priority: 100,
      order: 0,
      maxItems: 1,
    },
  });
}

async function main() {
  await seedKindDefinitions();
  await backfillReleasesAndTracks();
  await seedNewInteractiveExperience();
  await seedTrackRelatedContentBlocks();

  console.log("Related content seed/backfill completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
