import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeniusEmbed } from "./GeniusEmbed";
import styles from "./TrackDetail.module.css";
import {
  getCatalogTrackPageData,
  getCatalogTrackStaticParams,
} from "@/lib/music/catalog";
import { ListeningPanel } from "@/components/music/ListeningPanel";
import { RelatedContent } from "@/components/related-content/RelatedContent";

type TrackPageProps = {
  params: Promise<{
    albumSlug: string;
    trackSlug: string;
  }>;
};

export async function generateStaticParams() {
  return getCatalogTrackStaticParams();
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { albumSlug, trackSlug } = await params;
  const data = await getCatalogTrackPageData(albumSlug, trackSlug);

  if (!data) {
    notFound();
  }

  const { album, track, listeningLinks } = data;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <Link href={`/musica/${album.slug}`} className={styles.backLink}>
          ← Torna a {album.title}
        </Link>

        <section className={styles.layout}>
          <div>
            <div className={styles.coverFrame}>
              <Image
                src={album.cover}
                alt={`Cover di ${album.title}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28rem"
                className={styles.coverImage}
              />
            </div>
          </div>

          <div>
            <div className={styles.meta}>
              <span>Traccia {track.trackNumber}</span>
              <span>{album.type}</span>
              <span>{album.displayDate ?? album.year}</span>
            </div>

            <h1 className={styles.title}>{track.title}</h1>

            <p className={styles.albumTitle}>{album.title}</p>

            {track.credits?.length ? (
              <p className={styles.credits}>
                Credits: {track.credits.join(", ")}
              </p>
            ) : null}
          </div>
        </section>

        <section className={styles.sections}>
          <ListeningPanel links={listeningLinks} />

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Lyrics</h2>

            {track.geniusSongId ? (
              <div className={styles.geniusEmbed}>
                <GeniusEmbed
                  songId={track.geniusSongId}
                  title={track.title}
                  geniusUrl={track.geniusUrl}
                />
              </div>
            ) : track.geniusUrl ? (
              <p className={styles.empty}>
                Testo disponibile su{" "}
                <a href={track.geniusUrl} target="_blank" rel="noreferrer">
                  Genius
                </a>
                . L’embed verrà attivato quando sarà collegato il Genius song
                ID.
              </p>
            ) : track.lyrics ? (
              <div className={styles.lyrics}>{track.lyrics}</div>
            ) : (
              <p className={styles.empty}>
                Testo ufficiale non ancora collegato per questa traccia.
              </p>
            )}
          </div>

          {track.loreEntry ? (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Lore</h2>
              <p className={styles.empty}>{track.loreEntry}</p>
            </div>
          ) : null}

          <RelatedContent albumSlug={album.slug} trackSlug={track.slug} />
        </section>
      </div>
    </main>
  );
}
