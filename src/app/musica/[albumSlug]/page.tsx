import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./AlbumDetail.module.css";
import {
  getCatalogAlbumBySlug,
  getCatalogAlbumSlugs,
} from "@/lib/music/catalog";
import { RelatedContent } from "@/components/related-content/RelatedContent";

type AlbumPageProps = {
  params: Promise<{
    albumSlug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getCatalogAlbumSlugs();

  return slugs.map((albumSlug) => ({
    albumSlug,
  }));
}

function getTypeLabel(type: string) {
  return type.toUpperCase();
}

export async function generateMetadata({ params }: AlbumPageProps) {
  const { albumSlug } = await params;
  const album = await getCatalogAlbumBySlug(albumSlug);

  if (!album) {
    return {
      title: "Album non trovato",
    };
  }

  return {
    title: `${album.title} | JeeC`,
    description: album.description ?? undefined,
  };
}

export default async function AlbumDetailPage({ params }: AlbumPageProps) {
  const { albumSlug } = await params;
  const album = await getCatalogAlbumBySlug(albumSlug);

  if (!album) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href="/musica" className={styles.backLink}>
          ← Torna alla discografia
        </Link>

        <div className={styles.meta}>
          <span className={styles.metaItem}>{getTypeLabel(album.type)}</span>

          {album.displayDate ? (
            <span className={styles.metaItem}>{album.displayDate}</span>
          ) : (
            <span className={styles.metaItem}>{album.year}</span>
          )}

          {album.label ? (
            <span className={styles.metaItem}>{album.label}</span>
          ) : null}
        </div>

        <h1 className={styles.title}>{album.title}</h1>

        <section className={styles.layout}>
          <div>
            <div className={styles.coverFrame}>
              <Image
                src={album.cover}
                alt={`Cover di ${album.title}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 31rem"
                className={styles.coverImage}
              />
            </div>

            {album.description ? (
              <p className={styles.description}>{album.description}</p>
            ) : null}
          </div>

          <div className={styles.trackList}>
            {album.tracks.map((track) => (
              <Link
                key={track.slug}
                href={`/musica/${album.slug}/${track.slug}`}
                className={styles.track}
              >
                <span className={styles.trackNumber}>
                  {String(track.trackNumber).padStart(2, "0")}
                </span>

                <span className={styles.trackInfo}>
                  <span className={styles.trackTitle}>{track.title}</span>

                  {track.credits?.length ? (
                    <span className={styles.trackCredits}>
                      Credits: {track.credits.join(", ")}
                    </span>
                  ) : null}
                </span>

                {track.duration ? (
                  <span className={styles.trackDuration}>{track.duration}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.relatedContentSlot}>
          <RelatedContent releaseSlug={album.slug} />
        </div>
      </div>
    </main>
  );
}
