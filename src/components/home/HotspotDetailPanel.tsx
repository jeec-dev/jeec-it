import Image from "next/image";
import Link from "next/link";
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

      <div className={styles.trackBox}>
        <p className={styles.trackLabel}>Track</p>
        {hotspot.relatedTracks?.length ? (
          <div className={styles.trackLinks}>
            {hotspot.relatedTracks.map((track) => (
              <Link
                key={track.href}
                href={track.href}
                className={styles.trackLink}
              >
                {track.title}
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.trackTitle}>{hotspot.trackTitle}</p>
        )}
      </div>

      <p className={styles.content}>{hotspot.content}</p>

      {hotspot.playerUrl ? (
        <iframe
          src={hotspot.playerUrl}
          className={styles.player}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <div className={styles.playerPlaceholder}>
          Player non ancora collegato.
        </div>
      )}

      {hotspot.href && (
        <Link href={hotspot.href} className={styles.catalogLink}>
          Apri scheda catalogo
        </Link>
      )}
    </aside>
  );
}
