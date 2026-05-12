import Image from "next/image";
import Link from "next/link";
import { getEventStatusLabel, getLiveEvents } from "@/lib/events/events";
import styles from "./EventsPage.module.css";

export const metadata = {
  title: "Eventi | JeeC",
  description:
    "Date live, biglietti, dettagli evento e coordinate live di JeeC.",
};

export const dynamic = "force-dynamic";

function formatEventDate(startsAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(startsAt));
}

function EventCard({
  event,
  index,
}: {
  event: Awaited<ReturnType<typeof getLiveEvents>>[number];
  index: number;
}) {
  return (
    <Link href={`/eventi/${event.slug}`} className={styles.card}>
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

        <span className={styles.status} data-status={event.status ?? "unknown"}>
          {getEventStatusLabel(event)}
        </span>
      </div>
    </Link>
  );
}

export default async function EventsPage() {
  const events = await getLiveEvents();
  const now = new Date();

  const upcomingEvents = events
    .filter((event) => new Date(event.startsAt).getTime() >= now.getTime())
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );

  const pastEvents = events
    .filter((event) => new Date(event.startsAt).getTime() < now.getTime())
    .sort(
      (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
    );

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>Live transmission</p>
        <h1 className={styles.title}>Eventi</h1>

        <p className={styles.description}>
          Prossime date, archivio live, biglietti, venue e coordinate. Quando
          Bandsintown è configurato, le date vengono sincronizzate
          automaticamente.
        </p>

        <section className={styles.section} aria-labelledby="upcoming-events">
          <h2 id="upcoming-events" className={styles.sectionTitle}>
            Prossime date
          </h2>

          {upcomingEvents.length ? (
            <div className={styles.grid}>
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyLabel}>No active signal</p>
              <h3>Nessuna data annunciata</h3>
              <p>
                Le prossime coordinate live compariranno qui appena saranno
                disponibili.
              </p>
            </div>
          )}
        </section>

        {pastEvents.length > 0 ? (
          <section className={styles.section} aria-labelledby="past-events">
            <p className={styles.kicker}>Live archive</p>
            <h2 id="past-events" className={styles.sectionTitle}>
              Eventi passati
            </h2>

            <div className={styles.grid}>
              {pastEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={upcomingEvents.length + index}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
