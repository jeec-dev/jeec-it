import type { LiveEvent, LiveEventStatus } from "@/types/event";

type BandsintownArtist = {
  name?: string;
  image_url?: string;
  thumb_url?: string;
};

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
};

type BandsintownEvent = {
  id?: string;
  title?: string;
  datetime?: string;
  description?: string;
  url?: string;
  venue?: BandsintownVenue;
  offers?: BandsintownOffer[];
  lineup?: string[];
  artist?: BandsintownArtist;
  artists?: BandsintownArtist[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTicketOffer(event: BandsintownEvent) {
  return event.offers?.find((offer) => offer.url) ?? null;
}

function getEventStatus(event: BandsintownEvent): {
  status: LiveEventStatus;
  statusLabel: string;
} {
  const ticketOffer = getTicketOffer(event);
  const rawStatus = ticketOffer?.status?.toLowerCase();

  if (rawStatus?.includes("sold")) {
    return {
      status: "sold-out",
      statusLabel: "Sold out",
    };
  }

  if (ticketOffer?.url) {
    return {
      status: "available",
      statusLabel: "Biglietti disponibili",
    };
  }

  return {
    status: "coming-soon",
    statusLabel: "Info in arrivo",
  };
}

function getEventImage(event: BandsintownEvent) {
  return (
    event.artist?.image_url ??
    event.artist?.thumb_url ??
    event.artists?.[0]?.image_url ??
    event.artists?.[0]?.thumb_url
  );
}

function normalizeBandsintownEvent(event: BandsintownEvent): LiveEvent | null {
  if (!event.id || !event.datetime) {
    return null;
  }

  const venue = event.venue;
  const ticketOffer = getTicketOffer(event);
  const { status, statusLabel } = getEventStatus(event);

  const title =
    event.title ??
    ["JeeC Live", venue?.city].filter(Boolean).join(" · ") ??
    "JeeC Live";

  const citySlug = venue?.city ? slugify(venue.city) : "live";
  const dateSlug = event.datetime.slice(0, 10);
  const slug = slugify(`${title}-${citySlug}-${dateSlug}-${event.id}`);

  return {
    id: event.id,
    slug,
    title,
    startsAt: event.datetime,
    venueName: venue?.name,
    city: venue?.city,
    region: venue?.region,
    country: venue?.country,
    address: venue?.street_address,
    latitude: venue?.latitude ? Number(venue.latitude) : undefined,
    longitude: venue?.longitude ? Number(venue.longitude) : undefined,
    description: event.description,
    image: getEventImage(event),
    ticketUrl: ticketOffer?.url,
    bandsintownUrl: event.url,
    lineup: event.lineup,
    status,
    statusLabel,
  };
}

export async function getBandsintownEvents(): Promise<LiveEvent[]> {
  const artistName = process.env.BANDSINTOWN_ARTIST_NAME;
  const appId = process.env.BANDSINTOWN_APP_ID;

  if (!artistName || !appId) {
    return [];
  }

  const url = new URL(
    `https://rest.bandsintown.com/artists/${encodeURIComponent(
      artistName,
    )}/events`,
  );

  url.searchParams.set("app_id", appId);
  url.searchParams.set("date", "upcoming");

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 60 * 60,
      },
    });

    if (!response.ok) {
      console.warn(
        `Bandsintown API returned ${response.status}: ${response.statusText}`,
      );

      return [];
    }

    const data = (await response.json()) as BandsintownEvent[];

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(normalizeBandsintownEvent)
      .filter((event): event is LiveEvent => Boolean(event));
  } catch (error) {
    console.warn("Unable to fetch Bandsintown events.", error);

    return [];
  }
}
