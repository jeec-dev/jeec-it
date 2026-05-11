import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums } from "@/data/albums";
import styles from "./AlbumDetail.module.css";

type AlbumPageProps = {
  params: Promise<{
    albumSlug: string;
  }>;
};

export function generateStaticParams() {
  return albums.map((album) => ({
    albumSlug: album.slug,
  }));
}

function getTypeLabel(type: string) {
  return type.toUpperCase();
}

export async function generateMetadata({ params }: AlbumPageProps) {
  const { albumSlug } = await params;
  const album = albums.find((item) => item.slug === albumSlug);

  if (!album) {
    return {
      title: "Album non trovato",
    };
  }

  return {
    title: `${album.title} | JeeC`,
    description: album.description,
  };
}

export default async function AlbumDetailPage({ params }: AlbumPageProps) {
  const { albumSlug } = await params;
  const album = albums.find((item) => item.slug === albumSlug);

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
            {albums.map((album, index) => (
              <Link
                key={album.slug}
                href={`/musica/${album.slug}`}
                className={styles.card}
              >
                <div className={styles.coverFrame}>
                  <Image
                    src={album.cover}
                    alt={`Cover di ${album.title}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={styles.coverImage}
                  />
                </div>

                <p className={styles.type}>{getTypeLabel(album.type)}</p>
                <h2 className={styles.name}>{album.title}</h2>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
