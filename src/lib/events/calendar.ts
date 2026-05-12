import type { LiveEvent } from "../../types/event";

function formatGoogleCalendarDate(date: string) {
  return new Date(date).toISOString().replace(/[-:]/g, "").replace(".000", "");
}

function getEventLocation(event: LiveEvent) {
  return [
    event.venueName,
    event.address,
    event.city,
    event.region,
    event.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getGoogleMapsUrl(event: LiveEvent) {
  if (event.mapsUrl) {
    return event.mapsUrl;
  }

  if (event.latitude && event.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
  }

  const location = getEventLocation(event);

  if (!location) {
    return undefined;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location,
  )}`;
}

export function getShareText(event: LiveEvent) {
  const location = getEventLocation(event);

  return [
    event.title,
    location ? `@ ${location}` : undefined,
    new Date(event.startsAt).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function getGoogleCalendarUrl(event: LiveEvent) {
  const startDate = formatGoogleCalendarDate(event.startsAt);

  const endDate = event.endsAt
    ? formatGoogleCalendarDate(event.endsAt)
    : formatGoogleCalendarDate(
        new Date(
          new Date(event.startsAt).getTime() + 2 * 60 * 60 * 1000,
        ).toISOString(),
      );

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: [event.description, event.bandsintownUrl, event.ticketUrl]
      .filter(Boolean)
      .join("\n\n"),
    location: getEventLocation(event),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
