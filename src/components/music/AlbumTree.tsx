import Image from "next/image";
import { albums } from "@/data/albums";
import { TrackCard } from "@/components/music/TrackCard";

export function AlbumTree() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">
          Discografia
        </p>
        <h2 className="mt-3 text-4xl font-bold text-white">
          Albero album e tracce
        </h2>
        <p className="mt-4 max-w-2xl text-white/60">
          Una mappa navigabile tra album, tracce, lore, testi, video e player.
        </p>
      </div>

      <div className="space-y-8">
        {albums.map((album) => (
          <article
            key={album.slug}
            className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[260px_1fr]"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <Image
                src={album.cover}
                alt={`Copertina ${album.title}`}
                width={520}
                height={520}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                {album.type}
              </p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                {album.title}
              </h3>

              {album.spotifyUrl && (
                <a
                  href={album.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white hover:text-white"
                >
                  Ascolta album
                </a>
              )}

              <div className="mt-6 grid gap-4">
                {album.tracks.map((track, index) => (
                  <TrackCard
                    key={track.slug}
                    track={track}
                    index={index}
                    albumSlug={album.slug}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}