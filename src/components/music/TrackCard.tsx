import Link from "next/link";
import type { Track } from "@/types/music";

type TrackCardProps = {
  track: Track;
  index: number;
  albumSlug: string;
};

export function TrackCard({ track, index, albumSlug }: TrackCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
        Traccia {index + 1}
      </p>

      <h3 className="mt-2 text-xl font-semibold text-white">{track.title}</h3>
      <Link
        href={`/musica/${albumSlug}/${track.slug}`}
        className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white hover:text-white"
        >
        Apri scheda traccia
      </Link>

      {track.loreEntry && (
        <p className="mt-2 text-sm text-white/50">
          Lore collegata: {track.loreEntry}
        </p>
      )}

      {track.credits && track.credits.length > 0 && (
        <p className="mt-3 text-sm text-white/40">
          Credits: {track.credits.join(", ")}
        </p>
      )}

      {track.spotifyUrl && (
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white hover:text-white"
        >
          Apri su Spotify
        </a>
      )}
    </article>
  );
}