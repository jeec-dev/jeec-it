import type { Album } from "@/types/music";
import type { DbCatalogRelease } from "@/lib/music/catalog-db";

function mapReleaseType(type: string): Album["type"] {
  if (type === "SINGLE") {
    return "single";
  }

  return "album";
}

export function dbReleaseToAlbum(release: DbCatalogRelease): Album {
  const primaryStreamingLink = release.externalLinks.find(
    (link) => link.type === "STREAMING" && link.isPrimary,
  );

  const fallbackStreamingLink = release.externalLinks.find(
    (link) => link.type === "STREAMING",
  );

  return {
    slug: release.slug,
    title: release.title,
    type: mapReleaseType(release.type),
    year: release.year?.toString() ?? "undefined",
    label: release.label ?? undefined,
    description: release.description ?? undefined,
    cover: `/images/covers/${release.slug}.jpg`,
    spotifyUrl:
      primaryStreamingLink?.url ?? fallbackStreamingLink?.url ?? undefined,
    tracks: release.tracks.map((track, index) => ({
      trackNumber: track.position ?? index + 1,
      slug: track.slug,
      title: track.title,
      durationMs: track.durationMs ?? undefined,
      spotifyUrl:
        track.externalLinks.find((link) => link.type === "STREAMING")?.url ??
        undefined,
      credits: [],
    })),
  };
}
