import Image from "next/image";
import Link from "next/link";
import { orderedEvents } from "@/data/events";
import styles from "./EventsPage.module.css";
import { getEventStatusLabel } from "@/lib/events/events";

export const metadata = {
  title: "Eventi | JeeC",
  description: "Date live, biglietti e appuntamenti ufficiali di JeeC.",
};

export default function EventiPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>Live transmission</p>
        <h1 className={styles.title}>Eventi</h1>

        <p className={styles.description}>
          Date live, listening session e apparizioni speciali. Ogni evento ha
          una pagina dedicata con dettagli, biglietti, condivisione e
          calendario.
        </p>

        <div className={styles.grid}>
          {orderedEvents.map((event) => (
            <Link
              key={event.slug}
              href={`/eventi/${event.slug}`}
              className={styles.card}
            >
              {event.image ? (
                <div className={styles.coverFrame}>
                  <Image
                    src={event.image}
                    alt={`Immagine evento ${event.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 18rem"
                    className={styles.coverImage}
                  />
                </div>
              ) : null}

              <div>
                <span
                  className={styles.status}
                  data-status={event.status ?? "unknown"}
                >
                  {getEventStatusLabel(event)}
                </span>

                <h2 className={styles.eventTitle}>{event.title}</h2>

                <div className={styles.meta}>
                  <span>{event.startsAt}</span>
                  <span>{event.venueName}</span>
                  <span>{event.city}</span>
                </div>

                <p className={styles.excerpt}>{event.description}</p>

                <span className={styles.cta}>Apri evento →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
