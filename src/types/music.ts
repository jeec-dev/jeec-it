export type ExternalLink = {
  label: string;
  href: string;
};

export type Track = {
  slug: string;
  title: string;
  trackNumber: number;
  duration?: string;

  lyrics?: string;
  lyricsNote?: string;

  spotifyUrl?: string;
  spotifyEmbedUrl?: string;

  youtubeUrl?: string;
  youtubeEmbedUrl?: string;

  geniusUrl?: string;
  geniusSongId?: string;

  appleMusicUrl?: string;
  youtubeMusicUrl?: string;

  loreEntry?: string;
  credits?: string[];
  featuredArtists?: string[];
  externalLinks?: ExternalLink[];
};

export type Album = {
  slug: string;
  title: string;
  type: "album" | "ep" | "single";
  cover: string;
  year: string;
  releaseDate?: string;
  displayDate?: string;
  label?: string;
  description?: string;
  spotifyUrl?: string;
  tracks: Track[];
};
