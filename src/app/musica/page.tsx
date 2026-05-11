import Image from "next/image";
import Link from "next/link";
import { albums } from "@/data/albums";
import styles from "./MusicCatalog.module.css";

function getTypeLabel(type: string) {
  return type.toUpperCase();
}

export default function MusicPage() {
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
          {albums.map((album) => (
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
