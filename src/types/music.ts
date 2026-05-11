export type Track = {
  slug: string;
  title: string;
  trackNumber: number;
  duration?: string;
  lyrics?: string;
  spotifyUrl?: string;
  videoUrl?: string;
  loreEntry?: string;
  credits?: string[];
  featuredArtists?: string[];
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
