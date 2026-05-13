import Image from "next/image";
import Link from "next/link";
import { albums } from "@/data/albums";
import styles from "./MusicCatalog.module.css";

function getTypeLabel(type: string) {
  return type.toUpperCase();
}

function getAlbumTime(album: (typeof albums)[number]) {
  if (album.releaseDate) {
    return new Date(album.releaseDate).getTime();
  }

  return new Date(`${album.year}-01-01`).getTime();
}

export const metadata = {
  title: "Musica",
  description:
    "Discografia ufficiale di JeeC: album, singoli, tracce, player, testi, credits e release dell’universo NEW.",
};

export const metadata = {
  title: "Musica",
  description: "Discografia ufficiale di JeeC.",
};

export default function MusicPage() {
  const orderedAlbums = [...albums].sort(
    (firstAlbum, secondAlbum) =>
      getAlbumTime(secondAlbum) - getAlbumTime(firstAlbum),
  );

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>Discografia</p>

        <h1 className={styles.title}>Musica</h1>

        <p className={styles.description}>
          Album, EP e singoli: una mappa visuale dei progetti di JeeC. Ogni
          copertina apre il dettaglio del progetto, con tracklist, credits,
          lore, testi e player.
        </p>

        <div className={styles.grid}>
          {orderedAlbums.map((album, index) => (
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
      </div>
    </main>
  );
}
