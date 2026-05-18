export const articleVideoProviders = ["YOUTUBE", "VIMEO", "EXTERNAL"] as const;

export type ArticleVideoProvider = (typeof articleVideoProviders)[number];

export function normalizeVideoProvider(value: unknown): ArticleVideoProvider {
  if (value === "YOUTUBE" || value === "VIMEO" || value === "EXTERNAL") {
    return value;
  }

  return "EXTERNAL";
}

export function detectVideoProvider(url: string): ArticleVideoProvider {
  if (/youtu\.be|youtube\.com/.test(url)) {
    return "YOUTUBE";
  }

  if (/vimeo\.com/.test(url)) {
    return "VIMEO";
  }

  return "EXTERNAL";
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/").filter(Boolean)[1] ?? null;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/").filter(Boolean)[1] ?? null;
      }

      return parsedUrl.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
}

function getVimeoVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.includes("vimeo.com")) {
      return null;
    }

    return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
}

export function getVideoEmbedUrl(
  url: string,
  provider: ArticleVideoProvider = detectVideoProvider(url),
): string | null {
  if (!url.trim()) {
    return null;
  }

  if (provider === "YOUTUBE") {
    const videoId = getYouTubeVideoId(url);

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (provider === "VIMEO") {
    const videoId = getVimeoVideoId(url);

    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  return null;
}
