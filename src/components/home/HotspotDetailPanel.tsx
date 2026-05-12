"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { albums } from "@/data/albums";
import { getSpotifyEmbedUrl } from "@/lib/music/embeds";
import type { Hotspot } from "@/types/hotspot";
import styles from "./HotspotDetailPanel.module.css";

type HotspotDetailPanelProps = {
  hotspot: Hotspot;
  closeUpImageSrc: string;
  onClose: () => void;
};

function getCloseUpOffset(coordinate: number, zoom: number) {
  const rawOffset = 50 - coordinate * zoom;
  const minOffset = 100 - zoom * 100;
  const maxOffset = 0;

  return Math.min(maxOffset, Math.max(minOffset, rawOffset));
}

export function HotspotDetailPanel({
  hotspot,
  closeUpImageSrc,
  onClose,
}: HotspotDetailPanelProps) {
  const closeUpX = hotspot.closeUpX ?? hotspot.x;
  const closeUpY = hotspot.closeUpY ?? hotspot.y;
  const zoom = hotspot.closeUpZoom ?? 5.2;

  const closeUpLeft = getCloseUpOffset(closeUpX, zoom);
  const closeUpTop = getCloseUpOffset(closeUpY, zoom);

  const album = albums.find(
    (item) => item.slug === "new-tutto-quello-che-non-ti-ho-detto",
  );

  const relatedTracks = useMemo(() => {
    if (hotspot.relatedTracks?.length) {
      return hotspot.relatedTracks;
    }

    if (hotspot.href && hotspot.trackTitle) {
      const trackSlug = hotspot.href.split("/").filter(Boolean).at(-1);

      if (trackSlug) {
        return [
          {
            title: hotspot.trackTitle,
            trackSlug,
            href: hotspot.href,
          },
        ];
      }
    }

    return [];
  }, [hotspot]);

  const [selectedTrackByHotspot, setSelectedTrackByHotspot] = useState<
    Record<string, string | undefined>
  >({});

  const selectedTrackSlug =
    selectedTrackByHotspot[hotspot.id] ?? relatedTracks[0]?.trackSlug;

  const selectedRelatedTrack =
    relatedTracks.find((track) => track.trackSlug === selectedTrackSlug) ??
    relatedTracks[0];

  function handleTrackSelect(trackSlug: string) {
    setSelectedTrackByHotspot((current) => ({
      ...current,
      [hotspot.id]: trackSlug,
    }));
  }

  const selectedCatalogTrack = album?.tracks.find(
    (track) => track.slug === selectedRelatedTrack?.trackSlug,
  );

  const spotifyEmbedUrl =
    selectedCatalogTrack?.spotifyEmbedUrl ??
    getSpotifyEmbedUrl(selectedCatalogTrack?.spotifyUrl);

  return (
    <aside className={styles.panel}>
      <div className={styles.dragHandle} />

      <div className={styles.header}>
        <div>
          <p className={styles.label}>Inspect Mode</p>
          <h2 className={styles.title}>{hotspot.title}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Chiudi pannello dettaglio"
        >
          ESC
        </button>
      </div>

      <div className={styles.closeUpFrame}>
        <div className={styles.closeUpViewport}>
          <div
            className={styles.closeUpImageLayer}
            style={{
              width: `${zoom * 100}%`,
              height: `${zoom * 100}%`,
              left: `${closeUpLeft}%`,
              top: `${closeUpTop}%`,
            }}
          >
            <Image
              src={closeUpImageSrc}
              alt={`Close up di ${hotspot.title}`}
              fill
              sizes="(max-width: 640px) 90vw, 380px"
              className={styles.closeUpImage}
            />
          </div>

          <div className={styles.closeUpVignette} />
          <div className={styles.closeUpReticle} />
          <div className={styles.closeUpTag}>Close Scan</div>
        </div>
      </div>

      <p className={styles.content}>{hotspot.content}</p>

      <div className={styles.trackBox}>
        <p className={styles.trackBoxLabel}>Tracce collegate</p>

        {relatedTracks.length > 1 ? (
          <div className={styles.trackTabs}>
            {relatedTracks.map((track) => (
              <button
                key={track.trackSlug}
                type="button"
                className={styles.trackTab}
                data-active={
                  track.trackSlug === selectedRelatedTrack?.trackSlug
                }
                onClick={() => handleTrackSelect(track.trackSlug)}
              >
                {track.title}
              </button>
            ))}
          </div>
        ) : selectedRelatedTrack ? (
          <p className={styles.trackTitle}>{selectedRelatedTrack.title}</p>
        ) : (
          <p className={styles.trackTitle}>{hotspot.trackTitle}</p>
        )}

        {selectedRelatedTrack?.note ? (
          <p className={styles.trackNote}>{selectedRelatedTrack.note}</p>
        ) : null}

        {selectedCatalogTrack ? (
          <div className={styles.trackMeta}>
            <span>
              Track {String(selectedCatalogTrack.trackNumber).padStart(2, "0")}
            </span>

            {selectedCatalogTrack.duration ? (
              <span>{selectedCatalogTrack.duration}</span>
            ) : null}

            {selectedCatalogTrack.featuredArtists?.length ? (
              <span>
                Feat. {selectedCatalogTrack.featuredArtists.join(", ")}
              </span>
            ) : null}
          </div>
        ) : null}

        {spotifyEmbedUrl ? (
          <iframe
            title={`Spotify player — ${selectedCatalogTrack?.title ?? hotspot.title}`}
            src={spotifyEmbedUrl}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={styles.spotifyPlayer}
          />
        ) : (
          <p className={styles.playerEmpty}>
            Spotify player non ancora collegato per questa traccia.
          </p>
        )}

        {selectedRelatedTrack ? (
          <Link href={selectedRelatedTrack.href} className={styles.trackCta}>
            Apri pagina traccia →
          </Link>
        ) : hotspot.href ? (
          <Link href={hotspot.href} className={styles.trackCta}>
            Apri pagina traccia →
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
