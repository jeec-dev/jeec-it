import { albums } from "../src/data/albums";
import { getDbCatalogReleases } from "../src/lib/music/catalog-db";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

async function main() {
  const dbReleases = await getDbCatalogReleases();

  const staticBySlug = new Map(albums.map((album) => [album.slug, album]));
  const dbBySlug = new Map(dbReleases.map((release) => [release.slug, release]));

  const missingInDb = albums
    .filter((album) => !dbBySlug.has(album.slug))
    .map((album) => album.slug);

  const missingInStatic = dbReleases
    .filter((release) => !staticBySlug.has(release.slug))
    .map((release) => release.slug);

  const mismatchedTrackCounts = albums
    .map((album) => {
      const dbRelease = dbBySlug.get(album.slug);

      if (!dbRelease) {
        return null;
      }

      const staticCount = album.tracks?.length ?? 0;
      const dbCount = dbRelease.tracks.length;

      if (staticCount === dbCount) {
        return null;
      }

      return {
        slug: album.slug,
        title: album.title,
        staticCount,
        dbCount,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const titleMismatches = albums
    .map((album) => {
      const dbRelease = dbBySlug.get(album.slug);

      if (!dbRelease) {
        return null;
      }

      if (normalize(album.title) === normalize(dbRelease.title)) {
        return null;
      }

      return {
        slug: album.slug,
        staticTitle: album.title,
        dbTitle: dbRelease.title,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  console.log("\nCatalog comparison");
  console.log("==================");
  console.log(`Static releases: ${albums.length}`);
  console.log(`DB releases:     ${dbReleases.length}`);

  console.log("\nMissing in DB:");
  console.table(missingInDb);

  console.log("\nMissing in static:");
  console.table(missingInStatic);

  console.log("\nTrack count mismatches:");
  console.table(mismatchedTrackCounts);

  console.log("\nTitle mismatches:");
  console.table(titleMismatches);

  if (
    missingInDb.length > 0 ||
    missingInStatic.length > 0 ||
    mismatchedTrackCounts.length > 0 ||
    titleMismatches.length > 0
  ) {
    process.exitCode = 1;
    return;
  }

  console.log("\n✅ DB catalog matches the static catalog at release/track-count level.");
}

main().catch((error) => {
  console.error("❌ Catalog comparison failed:");
  console.error(error);
  process.exitCode = 1;
});
