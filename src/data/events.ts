import type { LiveEvent } from "@/types/event";

export const fallbackEvents: LiveEvent[] = [
  {
    id: "jeec-live-milano-2026",
    slug: "jeec-live-milano-2026",
    title: "JeeC Live",
    startsAt: "2026-06-20T21:00:00+02:00",
    endsAt: "2026-06-20T23:00:00+02:00",
    venueName: "Venue Name",
    city: "Milano",
    country: "Italia",
    address: "Via esempio 1, Milano",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Milano",
    description:
      "Una live transmission dentro l'universo di JeeC, tra NEW, diario di bordo e nuove coordinate narrative.",
    image: "/images/covers/Copertina_DENTRO_UNA_FANTASY.jpg",
    gallery: [
      {
        src: "/images/covers/Copertina_DENTRO_UNA_FANTASY.jpg",
        alt: "Visual evento Dentro Una Fantasy",
        caption: "Mood fantasy/time-shift.",
      },
      {
        src: "/images/covers/Copertina_DA_DOMANI.jpg",
        alt: "Visual evento Da Domani",
        caption: "Coordinate future.",
      },
      {
        src: "/images/covers/Copertina_SENTOLEICHE.jpg",
        alt: "Visual evento Sentoleiche",
        caption: "Fase bosco / perdita.",
      },
    ],
    introVideoUrl: "https://www.youtube.com/watch?v=cPi-SE-X2E8",
    ticketUrl: "https://example.com/tickets",
    bandsintownUrl: "https://www.bandsintown.com/a/...",
    lineup: ["JeeC"],
    status: "available",
    statusLabel: "Biglietti disponibili",
  },
];

export const events = fallbackEvents;

export const orderedEvents = [...events].sort(
  (firstEvent, secondEvent) =>
    new Date(firstEvent.startsAt).getTime() -
    new Date(secondEvent.startsAt).getTime(),
);
