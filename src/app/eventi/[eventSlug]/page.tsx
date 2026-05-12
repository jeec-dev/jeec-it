import Image from "next/image";
import Link from "next/link";
import type { LiveEvent } from "@/types/event";
import { notFound } from "next/navigation";
import { getLiveEvent, getLiveEvents } from "@/lib/events/events";
import { getEventStatusLabel } from "@/lib/events/events";
import { getYouTubeEmbedUrl } from "@/lib/music/embeds";
import {
  getGoogleCalendarUrl,
  getGoogleMapsUrl,
  getShareText,
} from "@/lib/events/calendar";
import styles from "./EventDetail.module.css";

type EventPageProps = {
  params: Promise<{
    eventSlug: string;
  }>;
};

function formatEventDate(startsAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(startsAt));
}

function formatEventTime(startsAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

function getLocationLabel(event: LiveEvent) {
  return [event.venueName, event.city, event.country]
    .filter(Boolean)
    .join(" · ");
}

export async function generateStaticParams() {
  const events = await getLiveEvents();

  return events.map((event) => ({
    eventSlug: event.slug,
  }));
}

export async function generateMetadata({ params }: EventPageProps) {
  const { eventSlug } = await params;
  const event = await getLiveEvent(eventSlug);

  if (!event) {
    return {
      title: "Evento non trovato",
    };
  }

  return {
    title: `${event.title} | Eventi | JeeC`,
    description:
      event.description ??
      `${event.title} — ${getLocationLabel(event)} — ${formatEventDate(
        event.startsAt,
      )}`,
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { eventSlug } = await params;
  const event = await getLiveEvent(eventSlug);

  if (!event) {
    notFound();
  }

  const googleCalendarUrl = getGoogleCalendarUrl(event);
  const googleMapsUrl = getGoogleMapsUrl(event);

  const introVideoEmbedUrl =
    event.introVideoEmbedUrl ?? getYouTubeEmbedUrl(event.introVideoUrl);

  const galleryImages = event.gallery?.length
    ? event.gallery
    : event.image
      ? [{ src: event.image, alt: `Immagine evento ${event.title}` }]
      : [];

  const shareText = getShareText(event);
  const encodedShareText = encodeURIComponent(shareText);
  const encodedEventUrl = encodeURIComponent(`/eventi/${event.slug}`);

  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <Link href="/eventi" className={styles.backLink}>
          ← Torna agli eventi
        </Link>

        <header className={styles.hero}>
          <div>
            <div className={styles.eyebrowRow}>
              <p className={styles.kicker}>Live event</p>

              <span
                className={styles.status}
                data-status={event.status ?? "unknown"}
              >
                {getEventStatusLabel(event)}
              </span>
            </div>

            <h1 className={styles.title}>{event.title}</h1>

            <div className={styles.meta}>
              <span>{formatEventDate(event.startsAt)}</span>
              <span>{formatEventTime(event.startsAt)}</span>

              {event.venueName ? <span>{event.venueName}</span> : null}
              {event.city ? <span>{event.city}</span> : null}
            </div>
          </div>
        </header>

        <section className={styles.eventLayout}>
          <div className={styles.mainColumn}>
            <div className={styles.mediaFrame}>
              {introVideoEmbedUrl ? (
                <iframe
                  title={`Video intro — ${event.title}`}
                  src={introVideoEmbedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className={styles.videoEmbed}
                />
              ) : (
                <div className={styles.coverFallback}>
                  <span>JeeC</span>
                  <strong>Live transmission</strong>
                </div>
              )}
            </div>

            <section className={styles.panel}>
              <p className={styles.panelLabel}>Dettagli</p>

              <div className={styles.detailGrid}>
                {event.image ? (
                  <div className={styles.detailImageFrame}>
                    <Image
                      src={event.image}
                      alt={`Immagine evento ${event.title}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 28rem"
                      className={styles.detailImage}
                    />
                  </div>
                ) : null}

                <div>
                  {event.description ? (
                    <p>{event.description}</p>
                  ) : (
                    <p>
                      Dettagli evento in aggiornamento. Salva la data e torna
                      qui per informazioni su scaletta, venue, orari e
                      biglietti.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {galleryImages.length > 1 ? (
              <section className={styles.gallerySection}>
                <p className={styles.sectionLabel}>Gallery</p>

                <div className={styles.galleryGrid}>
                  {galleryImages.map((image) => (
                    <figure key={image.src} className={styles.galleryItem}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 24rem"
                        className={styles.galleryImage}
                      />

                      {image.caption ? (
                        <figcaption className={styles.galleryCaption}>
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className={styles.infoCard}>
            <p className={styles.cardLabel}>Coordinate</p>

            <dl className={styles.infoList}>
              <div>
                <dt>Data</dt>
                <dd>{formatEventDate(event.startsAt)}</dd>
              </div>

              <div>
                <dt>Ora</dt>
                <dd>{formatEventTime(event.startsAt)}</dd>
              </div>

              {event.venueName ? (
                <div>
                  <dt>Venue</dt>
                  <dd>{event.venueName}</dd>
                </div>
              ) : null}

              {event.address || event.city ? (
                <div>
                  <dt>Luogo</dt>
                  <dd>
                    {[event.address, event.city, event.region, event.country]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
              ) : null}

              {event.lineup?.length ? (
                <div>
                  <dt>Lineup</dt>
                  <dd>{event.lineup.join(", ")}</dd>
                </div>
              ) : null}
            </dl>

            <div className={styles.mainActions}>
              {event.ticketUrl ? (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryAction}
                >
                  Compra biglietto
                </a>
              ) : (
                <span className={styles.disabledAction}>
                  Biglietti in arrivo
                </span>
              )}

              {event.bandsintownUrl ? (
                <a
                  href={event.bandsintownUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.secondaryAction}
                >
                  Apri su Bandsintown
                </a>
              ) : null}
            </div>

            <div className={styles.utilityActions}>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryAction}
              >
                Salva su Google Calendar
              </a>

              {googleMapsUrl ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.secondaryAction}
                >
                  Indicazioni Google Maps
                </a>
              ) : null}

              <a
                href={`https://twitter.com/intent/tweet?text=${encodedShareText}`}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryAction}
              >
                Condividi su X
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedEventUrl}`}
                target="_blank"
                rel="noreferrer"
                className={styles.secondaryAction}
              >
                Condividi su Facebook
              </a>
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
}
