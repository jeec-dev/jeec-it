export type LiveEventStatus =
  | "available"
  | "sold-out"
  | "coming-soon"
  | "free-entry"
  | "cancelled";

export type LiveEventImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type LiveEvent = {
  id: string;
  slug: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  timezone?: string;

  venueName?: string;
  city?: string;
  region?: string;
  country?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;

  description?: string;
  image?: string;
  gallery?: LiveEventImage[];

  introVideoUrl?: string;
  introVideoEmbedUrl?: string;

  ticketUrl?: string;
  bandsintownUrl?: string;
  lineup?: string[];

  status?: LiveEventStatus;
  statusLabel?: string;
};
