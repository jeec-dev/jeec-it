export type Track = {
  slug: string;
  title: string;
  lyrics?: string;
  spotifyUrl?: string;
  videoUrl?: string;
  loreEntry?: string;
  credits?: string[];
};

export type Album = {
  slug: string;
  title: string;
  type: "album" | "ep" | "single";
  cover: string;
  spotifyUrl?: string;
  tracks: Track[];
};