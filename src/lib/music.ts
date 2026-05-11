import { albums } from "@/data/albums";

export function getAlbumBySlug(albumSlug: string) {
  return albums.find((album) => album.slug === albumSlug);
}

export function getTrackBySlugs(albumSlug: string, trackSlug: string) {
  const album = getAlbumBySlug(albumSlug);

  if (!album) {
    return null;
  }

  const track = album.tracks.find((item) => item.slug === trackSlug);

  if (!track) {
    return null;
  }

  return {
    album,
    track,
  };
}