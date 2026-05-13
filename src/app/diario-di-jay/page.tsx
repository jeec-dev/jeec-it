import Image from "next/image";
import Link from "next/link";
import { getDiaryEntries } from "@/lib/diary";
import styles from "./DiaryIndex.module.css";

export const metadata = {
  title: "Diario di Jay",
  description:
    "Il diario di bordo fantasy di Jay: un viaggio narrativo tra passato, futuro, amore, perdita e frammenti musicali.",
};

export default async function DiarioDiJayPage() {
  const diaryEntries = await getDiaryEntries();

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
          {diaryEntries.map((entry) => (
            <Link
              key={entry.metadata.slug}
              href={`/diario-di-jay/${entry.metadata.slug}`}
              className={styles.card}
            >
              {entry.metadata.cover ? (
                <div className={styles.coverFrame}>
                  <Image
                    src={entry.metadata.cover}
                    alt={`Cover di ${entry.metadata.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 18rem"
                    className={styles.coverImage}
                  />
                </div>
              ) : null}

              <div className={styles.content}>
                <p className={styles.chapter}>{entry.metadata.chapter}</p>
                <h2 className={styles.entryTitle}>{entry.metadata.title}</h2>
                <p className={styles.date}>{entry.metadata.displayDate}</p>
                <p className={styles.excerpt}>{entry.metadata.excerpt}</p>

                {entry.metadata.linkedTrackTitle ? (
                  <span className={styles.track}>
                    Traccia: {entry.metadata.linkedTrackTitle}
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
