import Image from "next/image";
import Link from "next/link";
import { getEventStatusLabel, getUpcomingEvents } from "@/lib/events/events";
import { getLiveEvents } from "@/lib/events/events";
import styles from "./EventsPage.module.css";

export const metadata = {
  title: "Eventi | JeeC",
  description:
    "Date live, biglietti, dettagli evento e coordinate dei prossimi appuntamenti di JeeC.",
};

function formatEventDate(startsAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(startsAt));
}

export default async function EventsPage() {
  const events = await getLiveEvents();
  const upcomingEvents = getUpcomingEvents(events);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>Live transmission</p>
        <h1 className={styles.title}>Eventi</h1>

        <p className={styles.description}>
          Prossime date, biglietti, venue e coordinate live. Quando Bandsintown
          è configurato, le date vengono sincronizzate automaticamente.
        </p>

        {upcomingEvents.length ? (
          <div className={styles.grid}>
            {upcomingEvents.map((event, index) => (
              <Link
                key={event.id}
                href={`/eventi/${event.slug}`}
                className={styles.card}
              >
                <div className={styles.imageFrame}>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={`Immagine evento ${event.title}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 24rem"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imageFallback}>JeeC Live</div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span>{formatEventDate(event.startsAt)}</span>
                    {event.city ? <span>{event.city}</span> : null}
                  </div>

                  <h2 className={styles.cardTitle}>{event.title}</h2>

                  <span
                    className={styles.status}
                    data-status={event.status ?? "unknown"}
                  >
                    {getEventStatusLabel(event)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyLabel}>No active signal</p>
            <h2>Nessuna data annunciata</h2>
            <p>
              Le prossime coordinate live compariranno qui appena saranno
              disponibili.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
