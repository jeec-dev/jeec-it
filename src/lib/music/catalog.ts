import { albums as staticAlbums } from "@/data/albums";
import type { Album, Track } from "@/types/music";
import { dbReleaseToAlbum } from "@/lib/music/catalog-adapter";
import { getStableEmbedUrl } from "@/lib/music/embeds";
import {
  getDbCatalogReleaseBySlug,
  getDbCatalogReleases,
} from "@/lib/music/catalog-db";

export async function getCatalogAlbums(): Promise<Album[]> {
  try {
    const dbReleases = await getDbCatalogReleases();

    if (dbReleases.length === 0) {
      return staticAlbums;
    }

    return dbReleases.map(dbReleaseToAlbum);
  } catch (error) {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DB_CATALOG_DEBUG === "true"
    ) {
      console.warn("[Catalog] Falling back to static albums:", error);
    }

    return staticAlbums;
  }
}

export async function getCatalogAlbumBySlug(
  slug: string,
): Promise<Album | null> {
  try {
    const dbRelease = await getDbCatalogReleaseBySlug(slug);

    if (!dbRelease) {
      return staticAlbums.find((album) => album.slug === slug) ?? null;
    }

    return dbReleaseToAlbum(dbRelease);
  } catch (error) {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DB_CATALOG_DEBUG === "true"
    ) {
      console.warn("[Catalog] Falling back to static album:", error);
    }

    return staticAlbums.find((album) => album.slug === slug) ?? null;
  }
}

export async function getCatalogAlbumSlugs(): Promise<string[]> {
  const albums = await getCatalogAlbums();

  return albums.map((album) => album.slug);
}

export type CatalogListeningLink = {
  key: string;
  sourceCode: string;
  sourceName: string;
  label: string;
  url: string;
  isPrimary: boolean;
  order: number;
  supportsEmbed: boolean;
  embedUrl?: string;
};

export type CatalogTrackPageData = {
  album: Album;
  track: Track;
  listeningLinks: CatalogListeningLink[];
};

type TrackWithKnownLinks = Track & {
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  youtubeMusicUrl?: string;
  deezerUrl?: string;
  tidalUrl?: string;
  soundcloudUrl?: string;
  soundCloudUrl?: string;
  geniusUrl?: string;
  lyricsUrl?: string;
};

const platformPriority = [
  "deezer",
  "apple_music",
  "youtube",
  "youtube_music",
  "tidal",
  "soundcloud",
  "spotify",
];

function getPlatformOrder(sourceCode: string, fallbackOrder: number) {
  const index = platformPriority.indexOf(sourceCode);

  if (index === -1) {
    return fallbackOrder + platformPriority.length;
  }

  return index;
}

function buildListeningLinksFromDbTrack(track: {
  externalLinks: Array<{
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
  }>;
}): CatalogListeningLink[] {
  return track.externalLinks
    .filter((link) => link.type === "STREAMING")
    .map((link) => {
      const sourceCode = link.source.code;
      const embedUrl = getStableEmbedUrl(sourceCode, link.url);

      return {
        key: link.id,
        sourceCode,
        sourceName: link.source.name,
        label: link.label,
        url: link.url,
        isPrimary: link.isPrimary,
        order: getPlatformOrder(sourceCode, link.order),
        supportsEmbed: Boolean(embedUrl),
        embedUrl,
      };
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

function buildListeningLinksFromStaticTrack(
  track: TrackWithKnownLinks,
): CatalogListeningLink[] {
  const rawLinks: Array<{
    sourceCode: string;
    sourceName: string;
    label: string;
    url?: string;
  }> = [
    {
      sourceCode: "deezer",
      sourceName: "Deezer",
      label: "Ascolta su Deezer",
      url: track.deezerUrl,
    },
    {
      sourceCode: "apple_music",
      sourceName: "Apple Music",
      label: "Ascolta su Apple Music",
      url: track.appleMusicUrl,
    },
    {
      sourceCode: "youtube_music",
      sourceName: "YouTube Music",
      label: "Ascolta su YouTube Music",
      url: track.youtubeMusicUrl,
    },
    {
      sourceCode: "youtube",
      sourceName: "YouTube",
      label: "Guarda/ascolta su YouTube",
      url: track.youtubeUrl,
    },
    {
      sourceCode: "tidal",
      sourceName: "TIDAL",
      label: "Ascolta su TIDAL",
      url: track.tidalUrl,
    },
    {
      sourceCode: "soundcloud",
      sourceName: "SoundCloud",
      label: "Ascolta su SoundCloud",
      url: track.soundcloudUrl ?? track.soundCloudUrl,
    },
    {
      sourceCode: "spotify",
      sourceName: "Spotify",
      label: "Apri su Spotify",
      url: track.spotifyUrl,
    },
  ];

  return rawLinks
    .filter((link): link is typeof link & { url: string } => Boolean(link.url))
    .map((link, index) => {
      const embedUrl = getStableEmbedUrl(link.sourceCode, link.url);

      return {
        key: `${link.sourceCode}-${index}`,
        sourceCode: link.sourceCode,
        sourceName: link.sourceName,
        label: link.label,
        url: link.url,
        isPrimary: index === 0,
        order: getPlatformOrder(link.sourceCode, index),
        supportsEmbed: Boolean(embedUrl),
        embedUrl,
      };
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

export async function getCatalogTrackPageData(
  albumSlug: string,
  trackSlug: string,
): Promise<CatalogTrackPageData | null> {
  try {
    const dbRelease = await getDbCatalogReleaseBySlug(albumSlug);

    if (dbRelease) {
      const album = dbReleaseToAlbum(dbRelease);
      const track = album.tracks.find((item) => item.slug === trackSlug);
      const dbTrack = dbRelease.tracks.find((item) => item.slug === trackSlug);

      if (track && dbTrack) {
        const staticAlbum = staticAlbums.find(
          (item) => item.slug === albumSlug,
        );
        const staticTrack = staticAlbum?.tracks.find(
          (item) => item.slug === trackSlug,
        ) as TrackWithKnownLinks | undefined;

        const dbListeningLinks = buildListeningLinksFromDbTrack(dbTrack);
        const staticListeningLinks = staticTrack
          ? buildListeningLinksFromStaticTrack(staticTrack)
          : [];

        const listeningLinks =
          dbListeningLinks.length > 0 ? dbListeningLinks : staticListeningLinks;

        return {
          album,
          track,
          listeningLinks,
        };
      }
    }
  } catch (error) {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.DB_CATALOG_DEBUG === "true"
    ) {
      console.warn("[Catalog] Falling back to static track page:", error);
    }
  }

  const staticAlbum = staticAlbums.find((album) => album.slug === albumSlug);

  if (!staticAlbum) {
    return null;
  }

  const staticTrack = staticAlbum.tracks.find(
    (track) => track.slug === trackSlug,
  ) as TrackWithKnownLinks | undefined;

  if (!staticTrack) {
    return null;
  }

  return {
    album: staticAlbum,
    track: staticTrack,
    listeningLinks: buildListeningLinksFromStaticTrack(staticTrack),
  };
}

export async function getCatalogTrackStaticParams(): Promise<
  Array<{ albumSlug: string; trackSlug: string }>
> {
  const albums = await getCatalogAlbums();

  return albums.flatMap((album) =>
    album.tracks.map((track) => ({
      albumSlug: album.slug,
      trackSlug: track.slug,
    })),
  );
}
