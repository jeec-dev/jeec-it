import { fallbackEvents } from "@/data/events";
import type { LiveEvent } from "@/types/event";
import { getBandsintownEvents } from "./bandsintown";

function mergeEventsWithFallbackOverrides(
  bandsintownEvents: LiveEvent[],
  fallbackEvents: LiveEvent[],
): LiveEvent[] {
  return bandsintownEvents.map((event) => {
    const override = fallbackEvents.find((fallbackEvent) => {
      return (
        fallbackEvent.bandsintownUrl &&
        event.bandsintownUrl &&
        fallbackEvent.bandsintownUrl === event.bandsintownUrl
      );
    });

    if (!override) {
      return event;
    }

    return {
      ...event,
      ...override,
      id: event.id,
      slug: override.slug ?? event.slug,
      startsAt: event.startsAt,
      endsAt: override.endsAt ?? event.endsAt,
      ticketUrl: override.ticketUrl ?? event.ticketUrl,
      bandsintownUrl: event.bandsintownUrl,
    };
  });
}

function sortEventsNewestFirst(events: LiveEvent[]): LiveEvent[] {
  return [...events].sort((a, b) => {
    return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
  });
}

function sortEventsOldestFirst(events: LiveEvent[]): LiveEvent[] {
  return [...events].sort((a, b) => {
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

export async function getLiveEvents(): Promise<LiveEvent[]> {
  const bandsintownEvents = await getBandsintownEvents();

  const events =
    bandsintownEvents.length > 0
      ? mergeEventsWithFallbackOverrides(bandsintownEvents, fallbackEvents)
      : fallbackEvents;

  return sortEventsNewestFirst(events);
}

export async function getLiveEvent(
  slug: string,
): Promise<LiveEvent | undefined> {
  const events = await getLiveEvents();

  return events.find((event) => event.slug === slug);
}

export async function getUpcomingEvents(): Promise<LiveEvent[]> {
  const events = await getLiveEvents();
  const now = new Date();

  return sortEventsOldestFirst(
    events.filter((event) => {
      return new Date(event.startsAt).getTime() >= now.getTime();
    }),
  );
}

export async function getPastEvents(): Promise<LiveEvent[]> {
  const events = await getLiveEvents();
  const now = new Date();

  return sortEventsNewestFirst(
    events.filter((event) => {
      return new Date(event.startsAt).getTime() < now.getTime();
    }),
  );
}

export function getEventStatusLabel(event: LiveEvent): string {
  if (event.statusLabel) {
    return event.statusLabel;
  }

  switch (event.status) {
    case "available":
      return "Biglietti disponibili";
    case "sold-out":
      return "Sold out";
    case "coming-soon":
      return "In arrivo";
    case "free-entry":
      return "Ingresso libero";
    case "cancelled":
      return "Annullato";
    default:
      return "Info evento";
  }
}
