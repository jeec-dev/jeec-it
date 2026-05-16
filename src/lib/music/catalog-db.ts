import { db } from "@/lib/db";

export type DbCatalogTrack = {
  id: string;
  slug: string;
  title: string;
  position: number | null;
  durationMs: number | null;
  isrc: string | null;
  externalLinks: {
    id: string;
    type: string;
    label: string;
    url: string;
    isPrimary: boolean;
    order: number;
    source: {
      code: string;
      name: string;
    };
  }[];
};

export type DbCatalogRelease = {
  id: string;
  slug: string;
  title: string;
  type: string;
  status: string;
  year: number | null;
  label: string | null;
  description: string | null;
  lore: string | null;
  artist: {
    slug: string;
    stageName: string;
    legalName: string | null;
  };
  tracks: DbCatalogTrack[];
  externalLinks: {
    id: string;
    type: string;
    label: string;
    url: string;
    isPrimary: boolean;
    order: number;
    source: {
      code: string;
      name: string;
    };
  }[];
  externalIds: {
    id: string;
    entityType: string;
    externalId: string;
    externalUrl: string | null;
    verificationStatus: string;
    source: {
      code: string;
      name: string;
    };
  }[];
};

export async function getDbCatalogReleases(): Promise<DbCatalogRelease[]> {
  const releases = await db.release.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      artist: {
        select: {
          slug: true,
          stageName: true,
          legalName: true,
        },
      },
      tracks: {
        orderBy: [{ position: "asc" }, { title: "asc" }],
        include: {
          externalLinks: {
            where: {
              isPublic: true,
            },
            orderBy: [{ order: "asc" }, { label: "asc" }],
            include: {
              source: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      externalLinks: {
        where: {
          isPublic: true,
        },
        orderBy: [{ order: "asc" }, { label: "asc" }],
        include: {
          source: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      externalIds: {
        orderBy: [{ entityType: "asc" }, { externalId: "asc" }],
        include: {
          source: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  return releases;
}

export async function getDbCatalogReleaseBySlug(
  slug: string,
): Promise<DbCatalogRelease | null> {
  const release = await db.release.findUnique({
    where: {
      slug,
    },
    include: {
      artist: {
        select: {
          slug: true,
          stageName: true,
          legalName: true,
        },
      },
      tracks: {
        orderBy: [{ position: "asc" }, { title: "asc" }],
        include: {
          externalLinks: {
            where: {
              isPublic: true,
            },
            orderBy: [{ order: "asc" }, { label: "asc" }],
            include: {
              source: {
                select: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      externalLinks: {
        where: {
          isPublic: true,
        },
        orderBy: [{ order: "asc" }, { label: "asc" }],
        include: {
          source: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      externalIds: {
        orderBy: [{ entityType: "asc" }, { externalId: "asc" }],
        include: {
          source: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!release || release.status !== "PUBLISHED") {
    return null;
  }

  return release;
}

export async function getDbCatalogTrackBySlugs(
  releaseSlug: string,
  trackSlug: string,
): Promise<DbCatalogTrack | null> {
  const release = await db.release.findUnique({
    where: {
      slug: releaseSlug,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!release || release.status !== "PUBLISHED") {
    return null;
  }

  const track = await db.track.findUnique({
    where: {
      releaseId_slug: {
        releaseId: release.id,
        slug: trackSlug,
      },
    },
    include: {
      externalLinks: {
        where: {
          isPublic: true,
        },
        orderBy: [{ order: "asc" }, { label: "asc" }],
        include: {
          source: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return track;
}
