import type { LiveEvent } from "@/types/event";

type BandsintownOffer = {
  type?: string;
  url?: string;
  status?: string;
};

type BandsintownVenue = {
  name?: string;
  city?: string;
  region?: string;
  country?: string;
  street_address?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  type?: string;
};

type BandsintownEvent = {
  id: string;
  artist_id?: string;
  url?: string;
  datetime?: string;
  title?: string;
  description?: string;
  lineup?: string[];
  offers?: BandsintownOffer[];
  venue?: BandsintownVenue;
};

const BANDSINTOWN_API_BASE = "https://rest.bandsintown.com";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTicketUrl(event: BandsintownEvent) {
  const availableOffer = event.offers?.find((offer) => {
    return offer.url && offer.status !== "unavailable";
  });

  return availableOffer?.url ?? event.url;
}

function getEventTitle(event: BandsintownEvent, artistName: string) {
  if (event.title?.trim()) {
    return event.title.trim();
  }

  const venueName = event.venue?.name?.trim();

  if (venueName) {
    return `${artistName} live @ ${venueName}`;
  }

  return `${artistName} live`;
}

function normalizeBandsintownEvent(
  event: BandsintownEvent,
  artistName: string,
): LiveEvent | null {
  if (!event.id || !event.datetime) {
    return null;
  }

  const title = getEventTitle(event, artistName);
  const venue = event.venue;
  const city = venue?.city?.trim();
  const country = venue?.country?.trim();
  const venueName = venue?.name?.trim();

  const slugBase = [title, city, country, event.datetime.slice(0, 10), event.id]
    .filter(Boolean)
    .join(" ");

  const latitude = venue?.latitude ? Number(venue.latitude) : undefined;
  const longitude = venue?.longitude ? Number(venue.longitude) : undefined;

  const mapsUrl =
    venueName || city
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [venueName, city, venue?.region, country].filter(Boolean).join(", "),
        )}`
      : undefined;

  return {
    id: `bandsintown-${event.id}`,
    slug: slugify(slugBase),
    title,
    startsAt: event.datetime,
    timezone: venue?.timezone,
    venueName,
    city,
    region: venue?.region,
    country,
    address: venue?.street_address,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
    mapsUrl,
    description: event.description,
    ticketUrl: getTicketUrl(event),
    bandsintownUrl: event.url,
    lineup: event.lineup ?? [artistName],
    status: getTicketUrl(event) ? "available" : "coming-soon",
    statusLabel: getTicketUrl(event) ? "Biglietti disponibili" : "In arrivo",
  };
}

export async function getBandsintownEvents(): Promise<LiveEvent[]> {
  const artistName = process.env.BANDSINTOWN_ARTIST_NAME;
  const appId = process.env.BANDSINTOWN_APP_ID;

  if (!artistName || !appId) {
    console.error("[Bandsintown] Missing env vars", {
      artistName,
      hasAppId: Boolean(appId),
    });

    return [];
  }

  const url = new URL(
    `/artists/${encodeURIComponent(artistName)}/events`,
    BANDSINTOWN_API_BASE,
  );

  url.searchParams.set("app_id", appId);
  url.searchParams.set("date", "all");

  console.log("[Bandsintown] artistName:", artistName);
  console.log("[Bandsintown] appId exists:", Boolean(appId));
  console.log("[Bandsintown] URL:", url.toString());

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate: 60 * 30,
      },
    });

    console.log("[Bandsintown] status:", response.status, response.statusText);

    if (!response.ok) {
      console.error(
        `[Bandsintown] Request failed: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data = (await response.json()) as
      | BandsintownEvent[]
      | { error?: string };

    if (!Array.isArray(data)) {
      console.error("[Bandsintown] Unexpected response:", data);
      return [];
    }

    console.log("[Bandsintown] raw data:", data);
    console.log("[Bandsintown] events count:", data.length);

    const normalizedEvents = data
      .map((event) => normalizeBandsintownEvent(event, artistName))
      .filter((event): event is LiveEvent => Boolean(event));

    console.log("[Bandsintown] normalized count:", normalizedEvents.length);

    return normalizedEvents;
  } catch (error) {
    console.error("[Bandsintown] Fetch failed:", error);
    return [];
  }
}
