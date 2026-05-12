import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums } from "@/data/albums";
import { getSpotifyEmbedUrl, getYouTubeEmbedUrl } from "@/lib/music/embeds";
import { GeniusEmbed } from "./GeniusEmbed";
import styles from "./TrackDetail.module.css";

type TrackPageProps = {
  params: Promise<{
    albumSlug: string;
    trackSlug: string;
  }>;
};

export function generateStaticParams() {
  return albums.flatMap((album) =>
    album.tracks.map((track) => ({
      albumSlug: album.slug,
      trackSlug: track.slug,
    })),
  );
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { albumSlug, trackSlug } = await params;
  const album = albums.find((item) => item.slug === albumSlug);
  const track = album?.tracks.find((item) => item.slug === trackSlug);

  if (!album || !track) {
    return {
      title: "Traccia non trovata",
    };
  }

  return {
    title: `${track.title} | ${album.title} | JeeC`,
    description:
      track.loreEntry ??
      `Scheda traccia di ${track.title}, dal progetto ${album.title}.`,
  };
}

export default async function TrackDetailPage({ params }: TrackPageProps) {
  const { albumSlug, trackSlug } = await params;

  const album = albums.find((item) => item.slug === albumSlug);
  const track = album?.tracks.find((item) => item.slug === trackSlug);

  if (!album || !track) {
    notFound();
  }

  const spotifyEmbedUrl =
    track.spotifyEmbedUrl ?? getSpotifyEmbedUrl(track.spotifyUrl);

  const youtubeEmbedUrl =
    track.youtubeEmbedUrl ?? getYouTubeEmbedUrl(track.youtubeUrl);

  const externalLinks = [
    track.spotifyUrl ? { label: "Spotify", href: track.spotifyUrl } : null,
    track.youtubeUrl ? { label: "YouTube", href: track.youtubeUrl } : null,
    track.geniusUrl ? { label: "Genius", href: track.geniusUrl } : null,
    track.appleMusicUrl
      ? { label: "Apple Music", href: track.appleMusicUrl }
      : null,
    track.youtubeMusicUrl
      ? { label: "YouTube Music", href: track.youtubeMusicUrl }
      : null,
    ...(track.externalLinks ?? []),
  ].filter(Boolean) as { label: string; href: string }[];

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

            {externalLinks.length ? (
              <div className={styles.actions}>
                {externalLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.action}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className={styles.sections}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Spotify player</h2>

            {spotifyEmbedUrl ? (
              <iframe
                title={`Spotify player — ${track.title}`}
                src={spotifyEmbedUrl}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className={`${styles.embed} ${styles.spotifyEmbed}`}
              />
            ) : (
              <p className={styles.empty}>
                Spotify player non ancora collegato per questa traccia.
              </p>
            )}
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Video</h2>

            {youtubeEmbedUrl ? (
              <iframe
                title={`YouTube video — ${track.title}`}
                src={youtubeEmbedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className={`${styles.embed} ${styles.youtubeEmbed}`}
              />
            ) : (
              <p className={styles.empty}>
                Video YouTube non ancora collegato per questa traccia.
              </p>
            )}
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Lyrics by Genius</h2>

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
                Lyrics Genius non ancora collegati per questa traccia.
              </p>
            )}
          </div>

          {track.loreEntry ? (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Lore</h2>
              <p className={styles.empty}>{track.loreEntry}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
