import { config as loadEnv } from "dotenv";
import type { PrismaClient } from "../src/generated/prisma";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

let db: PrismaClient;
let staticAlbums: typeof import("../src/data/albums").albums;

type SourceSeed = {
  code: string;
  name: string;
  baseUrl?: string;
};

type TrackSeed = {
  slug: string;
  title: string;
  position: number;
  durationMs?: number;
  publishedAt?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
  youtubeUrl?: string;
  geniusUrl?: string;
  geniusSongId?: string;
};

type ReleaseSeed = {
  slug: string;
  title: string;
  type: "ALBUM" | "EP" | "SINGLE" | "DELUXE" | "COMPILATION" | "LIVE" | "DEMO";
  coverUrl: string;
  year?: number;
  publishedAt?: string;
  label?: string;
  description?: string;
  lore?: string;
  tracks?: TrackSeed[];
};

type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "CONFLICT"
  | "REJECTED"
  | "MANUAL";

function toSeedDate(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function durationToMs(duration?: string) {
  if (!duration) {
    return undefined;
  }

  const [minutes, seconds] = duration.split(":").map(Number);

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return undefined;
  }

  return (minutes * 60 + seconds) * 1000;
}

const externalSources: SourceSeed[] = [
  {
    code: "official_site",
    name: "JeeC Official Website",
    baseUrl: "https://www.jeec.it",
  },
  {
    code: "spotify",
    name: "Spotify",
    baseUrl: "https://open.spotify.com",
  },
  {
    code: "apple_music",
    name: "Apple Music",
    baseUrl: "https://music.apple.com",
  },
  {
    code: "youtube",
    name: "YouTube",
    baseUrl: "https://www.youtube.com",
  },
  {
    code: "youtube_music",
    name: "YouTube Music",
    baseUrl: "https://music.youtube.com",
  },
  {
    code: "deezer",
    name: "Deezer",
    baseUrl: "https://www.deezer.com",
  },
  {
    code: "bandsintown",
    name: "Bandsintown",
    baseUrl: "https://www.bandsintown.com",
  },
  {
    code: "eventbrite",
    name: "Eventbrite",
    baseUrl: "https://www.eventbrite.com",
  },
  {
    code: "genius",
    name: "Genius",
    baseUrl: "https://genius.com",
  },
  {
    code: "musicbrainz",
    name: "MusicBrainz",
    baseUrl: "https://musicbrainz.org",
  },
  {
    code: "amazon_music",
    name: "Amazon Music",
    baseUrl: "https://music.amazon.com",
  },
  {
    code: "soundcloud",
    name: "SoundCloud",
    baseUrl: "https://soundcloud.com",
  },
];

const nineteenAprileTracks: TrackSeed[] = [
  {
    position: 1,
    slug: "the-show-must-go-on",
    title: "The Show Must Go On",
    durationMs: 171000,
  },
  {
    position: 2,
    slug: "with-the-music",
    title: "With the Music",
    durationMs: 181000,
  },
  {
    position: 3,
    slug: "change-game",
    title: "Change Game",
    durationMs: 179000,
  },
  {
    position: 4,
    slug: "my-addiction",
    title: "My Addiction",
    durationMs: 257000,
  },
  {
    position: 5,
    slug: "one-short-call",
    title: "One Short Call",
    durationMs: 192000,
  },
  {
    position: 6,
    slug: "inner-demons",
    title: "Inner Demons",
    durationMs: 303000,
  },
  {
    position: 7,
    slug: "mad",
    title: "Mad",
    durationMs: 207000,
  },
  {
    position: 8,
    slug: "the-child-with-no-name",
    title: "The Child With No Name",
    durationMs: 214000,
  },
  {
    position: 9,
    slug: "th3-m1ssing",
    title: "Th3 M1ssing",
    durationMs: 75000,
  },
  {
    position: 10,
    slug: "the-right-path-to-climb",
    title: "The Right Path to Climb",
    durationMs: 202000,
  },
  {
    position: 11,
    slug: "the-last-time",
    title: "The Last Time",
  },
  {
    position: 12,
    slug: "smiling-rain-oro",
    title: "Smiling Rain (Oro) [feat. SGI]",
    durationMs: 245000,
  },
  {
    position: 13,
    slug: "3-untold-truth-bonus-track",
    title: "3 [Untold Truth] (Bonus Track)",
  },
];

const newOriginalTracks: TrackSeed[] = [
  { position: 1, slug: "intro-raap", title: "Intro (Raap)" },
  {
    position: 2,
    slug: "riflessioni-pt-1-tempo",
    title: "Riflessioni, Pt. 1 (Tempo)",
  },
  {
    position: 3,
    slug: "nicotina-bojack-horseman",
    title: "Nicotina (Bojack Horseman)",
  },
  { position: 4, slug: "vada-come-vada", title: "Vada Come Vada" },
  { position: 5, slug: "gimmie-another", title: "Gimmie Another" },
  {
    position: 6,
    slug: "riflessioni-pt-2-morte",
    title: "Riflessioni, Pt. 2 (Morte)",
  },
  {
    position: 7,
    slug: "inverno-e-soldi-rick-e-morty",
    title: "Inverno & Soldi (Rick & Morty)",
  },
  { position: 8, slug: "if-i-die-tonight", title: "If I Die Tonight" },
  { position: 9, slug: "ma-tanto-sto-bene", title: "Ma Tanto Sto Bene" },
  {
    position: 10,
    slug: "riflessioni-pt-3-amore",
    title: "Riflessioni, Pt. 3 (Amore)",
  },
  { position: 11, slug: "stammi-vicino-dai", title: "Stammi Vicino Dai" },
  { position: 12, slug: "in-12-giorni", title: "In 12 Giorni" },
  { position: 13, slug: "lo-sai", title: "Lo Sai" },
  { position: 14, slug: "outro-ehi", title: "Outro (Ehi!)" },
];

const newDeluxeTracks: TrackSeed[] = [
  ...newOriginalTracks,
  {
    position: 15,
    slug: "una-formica-sulla-34esima-strada",
    title: "Una Formica Sulla 34esima Strada",
  },
  {
    position: 16,
    slug: "if-i-die-tonight-acoustic-version",
    title: "If I Die Tonight (Acoustic Version)",
  },
  {
    position: 17,
    slug: "pedine-come-voi",
    title: "Pedine (Come Voi)",
  },
  {
    position: 18,
    slug: "muovi",
    title: "MUOVI",
  },
];

const baseReleases: ReleaseSeed[] = [
  {
    slug: "new-tutto-quello-che-non-ti-ho-detto",
    title: "NEW (Tutto Quello Che Non Ti Ho Detto)",
    type: "DELUXE",
    coverUrl: "/images/covers/new-tutto-quello-che-non-ti-ho-detto.jpg",
    year: 2026,
    publishedAt: "2026-02-06",
    label: "Urban Film Music",
    description:
      "NEW (Tutto Quello Che Non Ti Ho Detto) è la deluxe edition che riapre l’universo di NEW a cinque anni dalla sua prima uscita. Il progetto raccoglie i 14 brani originali in versione remastered e 4 bonus track, trasformando l’album in un viaggio più completo tra ricordi, pensieri sospesi, relazioni, notti irrisolte e parole rimaste fuori campo.",
    tracks: newDeluxeTracks,
  },
  {
    slug: "new",
    title: "NEW",
    type: "ALBUM",
    coverUrl: "/images/covers/new.jpg",
    year: 2021,
    publishedAt: "2021-02-05",
    label: "1254940 Records DK",
    tracks: newOriginalTracks,
  },
  {
    slug: "19-aprile",
    title: "19 Aprile",
    type: "ALBUM",
    coverUrl: "/images/covers/19-aprile.jpg",
    year: 2019,
    publishedAt: "2019-04-19",
    tracks: nineteenAprileTracks,
  },
  {
    slug: "umami",
    title: "Umami",
    type: "SINGLE",
    coverUrl: "/images/covers/umami.jpg",
    year: 2024,
    publishedAt: "2024-10-18",
    tracks: [{ position: 1, slug: "umami", title: "Umami" }],
  },
  {
    slug: "sentoleiche",
    title: "Sentoleiche",
    type: "SINGLE",
    coverUrl: "/images/covers/sentoleiche.jpg",
    year: 2023,
    publishedAt: "2023-10-27",
    tracks: [{ position: 1, slug: "sentoleiche", title: "Sentoleiche" }],
  },
  {
    slug: "da-domani",
    title: "Da domani",
    type: "SINGLE",
    coverUrl: "/images/covers/da-domani.jpg",
    year: 2023,
    publishedAt: "2023-06-16",
    tracks: [{ position: 1, slug: "da-domani", title: "Da domani" }],
  },
  {
    slug: "dentro-una-fantasy",
    title: "Dentro Una Fantasy",
    type: "SINGLE",
    coverUrl: "/images/covers/dentro-una-fantasy.jpg",
    year: 2023,
    publishedAt: "2023-03-10",
    tracks: [
      { position: 1, slug: "dentro-una-fantasy", title: "Dentro Una Fantasy" },
    ],
  },
  {
    slug: "muovi-single",
    title: "Muovi",
    type: "SINGLE",
    coverUrl: "/images/covers/muovi.jpg",
    year: 2022,
    publishedAt: "2022-06-17",
    tracks: [{ position: 1, slug: "muovi", title: "MUOVI" }],
  },
  {
    slug: "pedine-come-voi-single",
    title: "Pedine (Come Voi)",
    type: "SINGLE",
    coverUrl: "/images/covers/pedine-come-voi.jpg",
    year: 2022,
    publishedAt: "2022-04-01",
    tracks: [
      { position: 1, slug: "pedine-come-voi", title: "Pedine (Come Voi)" },
    ],
  },
  {
    slug: "una-formica-sulla-34esima-strada-single",
    title: "Una Formica Sulla 34esima Strada",
    type: "SINGLE",
    coverUrl: "/images/covers/una-formica-sulla-34esima-strada.jpg",
    year: 2022,
    publishedAt: "2022-01-13",
    tracks: [
      {
        position: 1,
        slug: "una-formica-sulla-34esima-strada",
        title: "Una Formica Sulla 34esima Strada",
      },
    ],
  },
  {
    slug: "stammi-vicino-dai-single",
    title: "Stammi Vicino Dai",
    type: "SINGLE",
    coverUrl: "/images/covers/new.jpg",
    year: 2021,
    publishedAt: "2021-02-05",
    tracks: [
      { position: 1, slug: "stammi-vicino-dai", title: "Stammi Vicino Dai" },
    ],
  },
  {
    slug: "hope",
    title: "Hope",
    type: "SINGLE",
    coverUrl: "/images/covers/hope.jpg",
    year: 2020,
    publishedAt: "2020-09-24",
    tracks: [{ position: 1, slug: "hope", title: "Hope" }],
  },
  {
    slug: "if-i-die-tonight-acoustic-version-single",
    title: "If I Die Tonight (Acoustic Version)",
    type: "SINGLE",
    coverUrl: "/images/covers/if-i-die-tonight-acoustic-version.jpg",
    year: 2020,
    publishedAt: "2020-05-22",
    tracks: [
      {
        position: 1,
        slug: "if-i-die-tonight-acoustic-version",
        title: "If I Die Tonight (Acoustic Version)",
      },
    ],
  },
  {
    slug: "if-i-die-tonight-single",
    title: "If I Die Tonight",
    type: "SINGLE",
    coverUrl: "/images/covers/if-i-die-tonight.jpg",
    year: 2020,
    publishedAt: "2020-02-28",
    tracks: [
      { position: 1, slug: "if-i-die-tonight", title: "If I Die Tonight" },
    ],
  },
  {
    slug: "vada-come-vada-single",
    title: "Vada Come Vada",
    type: "SINGLE",
    coverUrl: "/images/covers/vada-come-vada.jpg",
    year: 2019,
    publishedAt: "2019-12-14",
    tracks: [{ position: 1, slug: "vada-come-vada", title: "Vada Come Vada" }],
  },
  {
    slug: "the-right-path-to-climb-ntd-version",
    title: "The Right Path to Climb (Ntd Version)",
    type: "SINGLE",
    coverUrl: "/images/covers/19-aprile.jpg",
    year: 2019,
    publishedAt: "2019-04-19",
    tracks: [
      {
        position: 1,
        slug: "the-right-path-to-climb-ntd-version",
        title: "The Right Path to Climb (Ntd Version)",
      },
    ],
  },
  {
    slug: "not-enough",
    title: "Not Enough",
    type: "SINGLE",
    coverUrl: "/images/covers/not-enough.jpg",
    year: 2019,
    publishedAt: "2019-04-19",
    tracks: [{ position: 1, slug: "not-enough", title: "Not Enough" }],
  },
  {
    slug: "one-beautiful-day",
    title: "One Beautiful Day",
    type: "SINGLE",
    coverUrl: "/images/covers/one-beautiful-day.jpg",
    year: 2019,
    publishedAt: "2019-04-19",
    tracks: [
      { position: 1, slug: "one-beautiful-day", title: "One Beautiful Day" },
    ],
  },
];

function getStaticAlbum(slug: string) {
  return staticAlbums.find((album) => album.slug === slug);
}

function getStaticTrack(albumSlug: string, trackSlug: string) {
  return getStaticAlbum(albumSlug)?.tracks.find((track) => {
    return track.slug === trackSlug;
  });
}

function enrichTrackSeed(releaseSlug: string, trackSeed: TrackSeed): TrackSeed {
  const staticTrack = getStaticTrack(releaseSlug, trackSeed.slug);

  return {
    ...trackSeed,
    durationMs: trackSeed.durationMs ?? durationToMs(staticTrack?.duration),
    spotifyUrl: trackSeed.spotifyUrl ?? staticTrack?.spotifyUrl,
    appleMusicUrl: trackSeed.appleMusicUrl ?? staticTrack?.appleMusicUrl,
    youtubeMusicUrl: trackSeed.youtubeMusicUrl ?? staticTrack?.youtubeMusicUrl,
    youtubeUrl: trackSeed.youtubeUrl ?? staticTrack?.youtubeUrl,
    geniusUrl: trackSeed.geniusUrl ?? staticTrack?.geniusUrl,
    geniusSongId: trackSeed.geniusSongId ?? staticTrack?.geniusSongId,
  };
}

let releases: ReleaseSeed[] = [];

async function getSourceId(code: string) {
  const source = await db.externalSource.findUnique({
    where: { code },
    select: { id: true },
  });

  if (!source) {
    throw new Error(`Missing ExternalSource with code: ${code}`);
  }

  return source.id;
}

async function upsertExternalIdentifier(input: {
  sourceCode: string;
  entityType:
    | "ARTIST"
    | "RELEASE"
    | "TRACK"
    | "VIDEO"
    | "EVENT"
    | "VENUE"
    | "PLAYLIST";
  externalId: string;
  externalUrl?: string;
  verificationStatus?: VerificationStatus;
  artistId?: string;
  releaseId?: string;
  trackId?: string;
}) {
  const sourceId = await getSourceId(input.sourceCode);
  const verificationStatus = input.verificationStatus ?? "VERIFIED";

  const ownerCount = [input.artistId, input.releaseId, input.trackId].filter(
    Boolean,
  ).length;

  if (ownerCount !== 1) {
    throw new Error(
      `ExternalIdentifier ${input.sourceCode}:${input.entityType}:${input.externalId} must have exactly one owner id.`,
    );
  }

  const existing = await db.externalIdentifier.findFirst({
    where: {
      sourceId,
      entityType: input.entityType,
      externalId: input.externalId,
      artistId: input.artistId,
      releaseId: input.releaseId,
      trackId: input.trackId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return db.externalIdentifier.update({
      where: {
        id: existing.id,
      },
      data: {
        externalUrl: input.externalUrl,
        verificationStatus,
      },
    });
  }

  return db.externalIdentifier.create({
    data: {
      sourceId,
      entityType: input.entityType,
      externalId: input.externalId,
      externalUrl: input.externalUrl,
      artistId: input.artistId,
      releaseId: input.releaseId,
      trackId: input.trackId,
      verificationStatus,
    },
  });
}

async function upsertExternalLink(input: {
  sourceCode: string;
  type:
    | "STREAMING"
    | "VIDEO"
    | "LYRICS"
    | "TICKETS"
    | "SOCIAL"
    | "PRESS"
    | "STORE"
    | "OTHER";
  label: string;
  url: string;
  isPrimary?: boolean;
  order?: number;
  releaseId?: string;
  trackId?: string;
}) {
  const sourceId = await getSourceId(input.sourceCode);

  const existing = await db.externalLink.findFirst({
    where: {
      sourceId,
      type: input.type,
      url: input.url,
      releaseId: input.releaseId,
      trackId: input.trackId,
    },
    select: { id: true },
  });

  if (existing) {
    return db.externalLink.update({
      where: { id: existing.id },
      data: {
        label: input.label,
        isPrimary: input.isPrimary ?? false,
        isPublic: true,
        order: input.order ?? 0,
        releaseId: input.releaseId,
        trackId: input.trackId,
      },
    });
  }

  return db.externalLink.create({
    data: {
      sourceId,
      type: input.type,
      label: input.label,
      url: input.url,
      isPrimary: input.isPrimary ?? false,
      isPublic: true,
      order: input.order ?? 0,
      releaseId: input.releaseId,
      trackId: input.trackId,
    },
  });
}

async function getTrackExternalLinks(trackSeed: TrackSeed) {
  return [
    trackSeed.spotifyUrl
      ? {
          sourceCode: "spotify",
          type: "STREAMING" as const,
          label: "Spotify",
          url: trackSeed.spotifyUrl,
          isPrimary: true,
          order: 10,
        }
      : null,
    trackSeed.appleMusicUrl
      ? {
          sourceCode: "apple_music",
          type: "STREAMING" as const,
          label: "Apple Music",
          url: trackSeed.appleMusicUrl,
          isPrimary: false,
          order: 20,
        }
      : null,
    trackSeed.youtubeMusicUrl
      ? {
          sourceCode: "youtube_music",
          type: "STREAMING" as const,
          label: "YouTube Music",
          url: trackSeed.youtubeMusicUrl,
          isPrimary: false,
          order: 30,
        }
      : null,
    trackSeed.youtubeUrl
      ? {
          sourceCode: "youtube",
          type: "VIDEO" as const,
          label: "YouTube",
          url: trackSeed.youtubeUrl,
          isPrimary: false,
          order: 40,
        }
      : null,
    trackSeed.geniusUrl
      ? {
          sourceCode: "genius",
          type: "LYRICS" as const,
          label: "Genius",
          url: trackSeed.geniusUrl,
          isPrimary: false,
          order: 50,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);
}

async function refreshTrackExternalLinks(
  trackId: string,
  trackSeed: TrackSeed,
) {
  const managedSourceIds = await Promise.all(
    ["spotify", "apple_music", "youtube_music", "youtube", "genius"].map(
      getSourceId,
    ),
  );

  await db.externalLink.deleteMany({
    where: {
      trackId,
      sourceId: {
        in: managedSourceIds,
      },
      type: {
        in: ["STREAMING", "VIDEO", "LYRICS"],
      },
    },
  });

  const links = await getTrackExternalLinks(trackSeed);

  for (const link of links) {
    await upsertExternalLink({
      sourceCode: link.sourceCode,
      type: link.type,
      label: link.label,
      url: link.url,
      isPrimary: link.isPrimary,
      order: link.order,
      trackId,
    });
  }
}

async function refreshTrackGeniusIdentifier(
  trackId: string,
  trackSeed: TrackSeed,
) {
  const geniusSourceId = await getSourceId("genius");

  await db.externalIdentifier.deleteMany({
    where: {
      trackId,
      sourceId: geniusSourceId,
      entityType: "TRACK",
    },
  });

  if (!trackSeed.geniusSongId) {
    return;
  }

  await upsertExternalIdentifier({
    sourceCode: "genius",
    entityType: "TRACK",
    externalId: trackSeed.geniusSongId,
    externalUrl: trackSeed.geniusUrl,
    verificationStatus: "MANUAL",
    trackId,
  });
}

async function seed() {
  console.log("🌱 Seeding canonical JeeC catalog...");

  const imports = await Promise.all([
    import("../src/data/albums"),
    import("../src/lib/db"),
  ]);

  staticAlbums = imports[0].albums;
  db = imports[1].db;

  releases = baseReleases.map((release) => ({
    ...release,
    tracks: release.tracks?.map((track) =>
      enrichTrackSeed(release.slug, track),
    ),
  }));

  const artist = await db.artist.upsert({
    where: { slug: "jeec" },
    update: {
      stageName: "JeeC",
      legalName: "Giosuè Rasi",
    },
    create: {
      slug: "jeec",
      stageName: "JeeC",
      legalName: "Giosuè Rasi",
    },
  });

  for (const source of externalSources) {
    await db.externalSource.upsert({
      where: { code: source.code },
      update: {
        name: source.name,
        baseUrl: source.baseUrl,
        enabled: true,
      },
      create: {
        code: source.code,
        name: source.name,
        baseUrl: source.baseUrl,
        enabled: true,
      },
    });
  }

  await upsertExternalIdentifier({
    sourceCode: "spotify",
    entityType: "ARTIST",
    externalId: "3m21RYc8hGmj86j7758WEI",
    externalUrl: "https://open.spotify.com/artist/3m21RYc8hGmj86j7758WEI",
    artistId: artist.id,
  });

  await upsertExternalIdentifier({
    sourceCode: "apple_music",
    entityType: "ARTIST",
    externalId: "1464882248",
    externalUrl: "https://music.apple.com/it/artist/jeec/1464882248",
    artistId: artist.id,
  });

  await upsertExternalIdentifier({
    sourceCode: "youtube",
    entityType: "ARTIST",
    externalId: "UCkCUcjznjZ9DuDTLKO0UhkQ",
    externalUrl: "https://www.youtube.com/channel/UCkCUcjznjZ9DuDTLKO0UhkQ",
    artistId: artist.id,
  });

  await upsertExternalIdentifier({
    sourceCode: "soundcloud",
    entityType: "ARTIST",
    externalId: "sonojeec",
    externalUrl: "https://soundcloud.com/sonojeec",
    artistId: artist.id,
  });

  const releaseBySlug = new Map<string, { id: string }>();
  const trackByReleaseAndSlug = new Map<string, { id: string }>();

  for (const releaseSeed of releases) {
    const releasePublishedAt = toSeedDate(releaseSeed.publishedAt);

    const release = await db.release.upsert({
      where: {
        slug: releaseSeed.slug,
      },
      update: {
        artistId: artist.id,
        title: releaseSeed.title,
        type: releaseSeed.type,
        status: "PUBLISHED",
        year: releaseSeed.year,
        publishedAt: releasePublishedAt,
        coverUrl: releaseSeed.coverUrl,
        label: releaseSeed.label,
        description: releaseSeed.description,
        lore: releaseSeed.lore,
      },
      create: {
        artistId: artist.id,
        slug: releaseSeed.slug,
        title: releaseSeed.title,
        type: releaseSeed.type,
        status: "PUBLISHED",
        year: releaseSeed.year,
        publishedAt: releasePublishedAt,
        coverUrl: releaseSeed.coverUrl,
        label: releaseSeed.label,
        description: releaseSeed.description,
        lore: releaseSeed.lore,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    releaseBySlug.set(release.slug, { id: release.id });

    for (const trackSeed of releaseSeed.tracks ?? []) {
      const trackPublishedAt =
        toSeedDate(trackSeed.publishedAt) ?? releasePublishedAt;

      const track = await db.track.upsert({
        where: {
          releaseId_slug: {
            releaseId: release.id,
            slug: trackSeed.slug,
          },
        },
        update: {
          title: trackSeed.title,
          position: trackSeed.position,
          durationMs: trackSeed.durationMs,
          publishedAt: trackPublishedAt,
        },
        create: {
          releaseId: release.id,
          slug: trackSeed.slug,
          title: trackSeed.title,
          position: trackSeed.position,
          durationMs: trackSeed.durationMs,
          publishedAt: trackPublishedAt,
        },
        select: {
          id: true,
        },
      });

      trackByReleaseAndSlug.set(`${release.slug}:${trackSeed.slug}`, {
        id: track.id,
      });

      await refreshTrackExternalLinks(track.id, trackSeed);
      await refreshTrackGeniusIdentifier(track.id, trackSeed);
    }
  }

  console.log(
    "✅ Canonical releases, tracks, cover URLs and track links seeded.",
  );

  const newDeluxe = releaseBySlug.get("new-tutto-quello-che-non-ti-ho-detto");
  const newOriginal = releaseBySlug.get("new");
  const nineteenAprile = releaseBySlug.get("19-aprile");
  const umami = releaseBySlug.get("umami");
  const pedineSingleTrack = trackByReleaseAndSlug.get(
    "pedine-come-voi-single:pedine-come-voi",
  );

  if (newDeluxe) {
    await upsertExternalIdentifier({
      sourceCode: "spotify",
      entityType: "RELEASE",
      externalId: "79BmHyu8SkBV00jTNyXzUD",
      externalUrl:
        "https://open.spotify.com/intl-it/album/79BmHyu8SkBV00jTNyXzUD",
      releaseId: newDeluxe.id,
    });

    await upsertExternalIdentifier({
      sourceCode: "amazon_music",
      entityType: "RELEASE",
      externalId: "B0GKN4JTZL",
      externalUrl: "https://music.amazon.in/albums/B0GKN4JTZL",
      releaseId: newDeluxe.id,
    });

    await upsertExternalLink({
      sourceCode: "official_site",
      type: "OTHER",
      label: "Pagina ufficiale jeec.it",
      url: "https://www.jeec.it/musica/new-tutto-quello-che-non-ti-ho-detto",
      isPrimary: true,
      order: 0,
      releaseId: newDeluxe.id,
    });

    await upsertExternalLink({
      sourceCode: "spotify",
      type: "STREAMING",
      label: "Ascolta su Spotify",
      url: "https://open.spotify.com/intl-it/album/79BmHyu8SkBV00jTNyXzUD",
      isPrimary: true,
      order: 1,
      releaseId: newDeluxe.id,
    });

    await upsertExternalLink({
      sourceCode: "amazon_music",
      type: "STREAMING",
      label: "Ascolta su Amazon Music",
      url: "https://music.amazon.in/albums/B0GKN4JTZL",
      order: 2,
      releaseId: newDeluxe.id,
    });
  }

  if (newOriginal) {
    await upsertExternalIdentifier({
      sourceCode: "spotify",
      entityType: "RELEASE",
      externalId: "4JwxzP77OVoH90y5owgaTI",
      externalUrl: "https://open.spotify.com/album/4JwxzP77OVoH90y5owgaTI",
      releaseId: newOriginal.id,
    });

    await upsertExternalLink({
      sourceCode: "official_site",
      type: "OTHER",
      label: "Pagina ufficiale jeec.it",
      url: "https://www.jeec.it/musica/new",
      isPrimary: true,
      order: 0,
      releaseId: newOriginal.id,
    });

    await upsertExternalLink({
      sourceCode: "spotify",
      type: "STREAMING",
      label: "Ascolta su Spotify",
      url: "https://open.spotify.com/album/4JwxzP77OVoH90y5owgaTI",
      isPrimary: true,
      order: 1,
      releaseId: newOriginal.id,
    });
  }

  if (nineteenAprile) {
    await upsertExternalIdentifier({
      sourceCode: "spotify",
      entityType: "RELEASE",
      externalId: "5NH9j9BaKcrUSvmrluNv7w",
      externalUrl: "https://open.spotify.com/album/5NH9j9BaKcrUSvmrluNv7w",
      releaseId: nineteenAprile.id,
    });

    await upsertExternalLink({
      sourceCode: "spotify",
      type: "STREAMING",
      label: "Ascolta su Spotify",
      url: "https://open.spotify.com/album/5NH9j9BaKcrUSvmrluNv7w",
      isPrimary: true,
      order: 1,
      releaseId: nineteenAprile.id,
    });
  }

  if (umami) {
    await upsertExternalIdentifier({
      sourceCode: "spotify",
      entityType: "RELEASE",
      externalId: "4o8G46aolDJEKLLXtUmS7i",
      externalUrl: "https://open.spotify.com/album/4o8G46aolDJEKLLXtUmS7i",
      releaseId: umami.id,
    });

    await upsertExternalLink({
      sourceCode: "spotify",
      type: "STREAMING",
      label: "Ascolta su Spotify",
      url: "https://open.spotify.com/album/4o8G46aolDJEKLLXtUmS7i",
      isPrimary: true,
      order: 1,
      releaseId: umami.id,
    });
  }

  if (pedineSingleTrack) {
    await upsertExternalIdentifier({
      sourceCode: "apple_music",
      entityType: "TRACK",
      externalId: "1612659941",
      externalUrl:
        "https://music.apple.com/it/song/pedine-come-voi-feat-jack-langellotti/1612659941",
      trackId: pedineSingleTrack.id,
    });

    await upsertExternalLink({
      sourceCode: "apple_music",
      type: "STREAMING",
      label: "Ascolta su Apple Music",
      url: "https://music.apple.com/it/song/pedine-come-voi-feat-jack-langellotti/1612659941",
      isPrimary: true,
      order: 1,
      trackId: pedineSingleTrack.id,
    });
  }

  console.log("✅ Canonical JeeC catalog seed completed.");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
