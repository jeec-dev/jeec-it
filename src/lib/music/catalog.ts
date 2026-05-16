import { albums as staticAlbums } from "@/data/albums";
import type { Album } from "@/types/music";
import { dbReleaseToAlbum } from "@/lib/music/catalog-adapter";
import { getDbCatalogReleases } from "@/lib/music/catalog-db";

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
