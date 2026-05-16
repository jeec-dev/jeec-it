import { albums as staticAlbums } from "@/data/albums";
import type { Album } from "@/types/music";
import { dbReleaseToAlbum } from "@/lib/music/catalog-adapter";
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
