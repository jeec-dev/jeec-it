import { fallbackEvents } from "@/data/events";
import type { LiveEvent, LiveEventStatus } from "@/types/event";

export function getEventTime(event: LiveEvent) {
  return new Date(event.startsAt).getTime();
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

export async function getLiveEvents() {
  return fallbackEvents;
}

export async function getLiveEvent(slug: string) {
  const events = await getLiveEvents();

  return events.find((event) => event.slug === slug);
}

const statusLabels: Record<LiveEventStatus, string> = {
  available: "Biglietti disponibili",
  "sold-out": "Sold out",
  "coming-soon": "Coming soon",
  "free-entry": "Ingresso libero",
  cancelled: "Annullato",
};

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
