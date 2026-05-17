import type { Album, Track } from "@/types/music";
import type { DbCatalogRelease, DbCatalogTrack } from "@/lib/music/catalog-db";
import { getSpotifyEmbedUrl } from "@/lib/music/embeds";

function mapReleaseType(type: string): Album["type"] {
  if (type === "SINGLE") {
    return "single";
  }

  if (type === "EP") {
    return "ep";
  }

  return "album";
}

function formatDuration(durationMs: number | null) {
  if (!durationMs) {
    return undefined;
  }

  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getReleaseExternalLink(
  release: DbCatalogRelease,
  sourceCode: string,
  type?: string,
) {
  return release.externalLinks.find((link) => {
    if (link.source.code !== sourceCode) {
      return false;
    }

    if (type && link.type !== type) {
      return false;
    }

    return true;
  })?.url;
}

function getTrackExternalLink(
  track: DbCatalogTrack,
  sourceCode: string,
  type?: string,
) {
  return track.externalLinks.find((link) => {
    if (link.source.code !== sourceCode) {
      return false;
    }

    if (type && link.type !== type) {
      return false;
    }

    return true;
  })?.url;
}

function getTrackExternalId(track: DbCatalogTrack, sourceCode: string) {
  return track.externalIds.find((externalId) => {
    return externalId.source.code === sourceCode;
  })?.externalId;
}

function dbTrackToTrack(track: DbCatalogTrack, index: number): Track {
  const spotifyUrl = getTrackExternalLink(track, "spotify", "STREAMING");
  const appleMusicUrl = getTrackExternalLink(track, "apple_music", "STREAMING");
  const youtubeMusicUrl = getTrackExternalLink(
    track,
    "youtube_music",
    "STREAMING",
  );
  const youtubeUrl = getTrackExternalLink(track, "youtube", "VIDEO");
  const geniusUrl = getTrackExternalLink(track, "genius", "LYRICS");
  const geniusSongId = getTrackExternalId(track, "genius");

  return {
    trackNumber: track.position ?? index + 1,
    slug: track.slug,
    title: track.title,
    duration: formatDuration(track.durationMs),
    spotifyUrl,
    spotifyEmbedUrl: getSpotifyEmbedUrl(spotifyUrl),
    appleMusicUrl,
    youtubeMusicUrl,
    youtubeUrl,
    geniusUrl,
    geniusSongId,
    credits: [],
  };
}

export function dbReleaseToAlbum(release: DbCatalogRelease): Album {
  const spotifyUrl = getReleaseExternalLink(release, "spotify", "STREAMING");

  return {
    slug: release.slug,
    title: release.title,
    type: mapReleaseType(release.type),
    year: release.year?.toString() ?? "",
    label: release.label ?? undefined,
    description: release.description ?? undefined,
    cover: release.coverUrl ?? "/images/covers/cover-placeholder.svg",
    spotifyUrl,
    tracks: release.tracks.map(dbTrackToTrack),
  };
}
