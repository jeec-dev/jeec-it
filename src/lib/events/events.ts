import { fallbackEvents } from "@/data/events";
import type { LiveEvent, LiveEventStatus } from "@/types/event";
import { getBandsintownEvents } from "./bandsintown";

const statusLabels: Record<LiveEventStatus, string> = {
  available: "Biglietti disponibili",
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
  "free-entry": "Ingresso libero",
  cancelled: "Annullato",
};

export function getEventTime(event: LiveEvent) {
  return new Date(event.startsAt).getTime();
}

export function getEventStatusLabel(event: LiveEvent) {
  if (event.statusLabel) {
    return event.statusLabel;
  }

  if (event.status) {
    return statusLabels[event.status];
  }

  if (event.ticketUrl) {
    return "Biglietti disponibili";
  }

  return "Info in arrivo";
}

export function getUpcomingEvents(events: LiveEvent[]) {
  const now = Date.now();

  return events
    .filter((event) => getEventTime(event) >= now)
    .sort(
      (firstEvent, secondEvent) =>
        getEventTime(firstEvent) - getEventTime(secondEvent),
    );
}

export function getPastEvents(events: LiveEvent[]) {
  const now = Date.now();

  return events
    .filter((event) => getEventTime(event) < now)
    .sort(
      (firstEvent, secondEvent) =>
        getEventTime(secondEvent) - getEventTime(firstEvent),
    );
}

function mergeEvents(apiEvents: LiveEvent[], localEvents: LiveEvent[]) {
  const eventsById = new Map<string, LiveEvent>();

  for (const event of localEvents) {
    eventsById.set(event.id, event);
  }

  for (const event of apiEvents) {
    const localOverride = eventsById.get(event.id);

    eventsById.set(event.id, {
      ...event,
      ...localOverride,
      gallery: localOverride?.gallery ?? event.gallery,
      introVideoUrl: localOverride?.introVideoUrl ?? event.introVideoUrl,
      introVideoEmbedUrl:
        localOverride?.introVideoEmbedUrl ?? event.introVideoEmbedUrl,
      image: localOverride?.image ?? event.image,
      mapsUrl: localOverride?.mapsUrl ?? event.mapsUrl,
      description: localOverride?.description ?? event.description,
    });
  }

  return [...eventsById.values()].sort(
    (firstEvent, secondEvent) =>
      getEventTime(firstEvent) - getEventTime(secondEvent),
  );
}

export async function getLiveEvents() {
  const bandsintownEvents = await getBandsintownEvents();

  return mergeEvents(bandsintownEvents, fallbackEvents);
}

export async function getLiveEvent(slug: string) {
  const events = await getLiveEvents();

  return events.find((event) => event.slug === slug);
}
