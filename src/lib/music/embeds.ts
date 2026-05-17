export function getSpotifyEmbedUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.pathname.split("/").filter(Boolean);

    const type = parts[0];
    const id = parts[1];

    if (!type || !id) {
      return undefined;
    }

    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return undefined;
  }
}

export function getYouTubeEmbedUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const id = parsedUrl.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : undefined;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const id = parsedUrl.searchParams.get("v");

      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export function getSoundCloudEmbedUrl(url: string) {
  try {
    const encodedUrl = encodeURIComponent(url);

    return `https://w.soundcloud.com/player/?url=${encodedUrl}&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  } catch {
    return undefined;
  }
}

export function getStableEmbedUrl(sourceCode: string, url: string) {
  if (sourceCode === "spotify") {
    return getSpotifyEmbedUrl(url);
  }

  if (sourceCode === "youtube" || sourceCode === "youtube_music") {
    return getYouTubeEmbedUrl(url);
  }

  if (sourceCode === "soundcloud") {
    return getSoundCloudEmbedUrl(url);
  }

  return undefined;
}

export function getStableEmbedHeight(sourceCode: string) {
  if (sourceCode === "spotify") {
    return 152;
  }

  if (sourceCode === "soundcloud") {
    return 166;
  }

  if (sourceCode === "youtube" || sourceCode === "youtube_music") {
    return 315;
  }

  return undefined;
}
