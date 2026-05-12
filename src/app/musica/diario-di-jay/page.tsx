import Image from "next/image";
import Link from "next/link";
import { orderedDiaryEntries } from "@/data/diary";
import styles from "./DiaryIndex.module.css";

export const metadata = {
  title: "Diario di Jay | JeeC",
  description:
    "Il diario di bordo fantasy di Jay: un viaggio narrativo tra passato, futuro, amore, perdita e frammenti musicali.",
};

export default function DiarioDiJayPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>Lore transmission</p>

        <h1 className={styles.title}>Diario di Jay</h1>

        <p className={styles.description}>
          Frammenti narrativi dall’universo di Jay: un viaggio iniziato nel
          1954, interrotto da un incidente impossibile e riaperto nel 2023 tra
          paure, amori, perdita e segnali fuori tempo.
        </p>

        <div className={styles.timeline}>
          {orderedDiaryEntries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/musica/diario-di-jay/${entry.slug}`}
              className={styles.card}
            >
              {entry.cover ? (
                <div className={styles.coverFrame}>
                  <Image
                    src={entry.cover}
                    alt={`Cover di ${entry.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 18rem"
                    className={styles.coverImage}
                  />
                </div>
              ) : null}

              <div className={styles.content}>
                <p className={styles.chapter}>{entry.chapter}</p>
                <h2 className={styles.entryTitle}>{entry.title}</h2>
                <p className={styles.date}>{entry.displayDate}</p>
                <p className={styles.excerpt}>{entry.excerpt}</p>

                {entry.linkedTrackTitle ? (
                  <span className={styles.track}>
                    Traccia: {entry.linkedTrackTitle}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
