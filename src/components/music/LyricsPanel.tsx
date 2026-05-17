import type { Track } from "@/types/music";
import { GeniusEmbed } from "@/components/music/GeniusEmbed";
import styles from "./LyricsPanel.module.css";

type LyricsPanelProps = {
  track: Track;
};

export function LyricsPanel({ track }: LyricsPanelProps) {
  const hasGeniusEmbed = Boolean(track.geniusSongId);
  const hasGeniusLink = Boolean(track.geniusUrl);
  const hasInlineLyrics = Boolean(track.lyrics);

  return (
    <section className={styles.panel} aria-labelledby="lyrics-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Lyrics</p>
        <h2 id="lyrics-title" className={styles.title}>
          Testo e annotazioni
        </h2>
        <p className={styles.description}>
          Lyrics ufficiali, annotazioni Genius o testo collegato alla traccia.
        </p>
      </div>

      {hasGeniusEmbed && track.geniusSongId ? (
        <div className={styles.embedShell}>
          <GeniusEmbed
            songId={track.geniusSongId}
            title={track.title}
            geniusUrl={track.geniusUrl}
          />
        </div>
      ) : hasInlineLyrics ? (
        <div className={styles.lyricsText}>
          {track.lyrics?.split("\n").map((line, index) => (
            <p key={`${track.slug}-line-${index}`}>{line || "\u00A0"}</p>
          ))}
        </div>
      ) : hasGeniusLink && track.geniusUrl ? (
        <div className={styles.fallback}>
          <p>
            Il testo è disponibile su Genius. L’embed verrà mostrato appena l’ID
            Genius sarà collegato nel catalogo.
          </p>

          <a href={track.geniusUrl} target="_blank" rel="noreferrer">
            Apri testo su Genius ↗
          </a>
        </div>
      ) : (
        <p className={styles.empty}>
          Il testo per questa traccia non è ancora disponibile nel catalogo.
        </p>
      )}

      {track.lyricsNote ? (
        <p className={styles.note}>{track.lyricsNote}</p>
      ) : null}
    </section>
  );
}
