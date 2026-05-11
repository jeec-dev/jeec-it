import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrackBySlugs } from "@/lib/music";

type TrackPageProps = {
  params: Promise<{
    albumSlug: string;
    trackSlug: string;
  }>;
};

export default async function TrackPage({ params }: TrackPageProps) {
  const { albumSlug, trackSlug } = await params;
  const result = getTrackBySlugs(albumSlug, trackSlug);

  if (!result) {
    notFound();
  }

  const { album, track } = result;

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <article className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[360px_1fr]">
        <aside>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <Image
              src={album.cover}
              alt={`Copertina ${album.title}`}
              width={720}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>

          <Link
            href="/musica"
            className="mt-6 inline-flex text-sm text-white/50 transition hover:text-white"
          >
            ← Torna alla musica
          </Link>
        </aside>

        <section>
          <p className="text-sm uppercase tracking-[0.4em] text-white/40">
            {album.title}
          </p>

          <h1 className="mt-4 text-5xl font-bold">{track.title}</h1>

          {track.credits && track.credits.length > 0 && (
            <p className="mt-4 text-white/50">
              Credits: {track.credits.join(", ")}
            </p>
          )}

          {track.spotifyUrl && (
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm text-white/70 transition hover:border-white hover:text-white"
            >
              Apri su Spotify
            </a>
          )}

          {track.videoUrl && (
            <a
              href={track.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-3 mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm text-white/70 transition hover:border-white hover:text-white"
            >
              Guarda video
            </a>
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-semibold">Testo</h2>

            {track.lyrics ? (
              <pre className="mt-4 whitespace-pre-wrap font-sans leading-7 text-white/70">
                {track.lyrics}
              </pre>
            ) : (
              <p className="mt-4 text-white/40">
                Testo non ancora disponibile.
              </p>
            )}
          </div>

          {track.loreEntry && (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-2xl font-semibold">Lore collegata</h2>
              <p className="mt-4 text-white/60">
                Questa traccia è collegata al frammento narrativo:{" "}
                <span className="text-white">{track.loreEntry}</span>
              </p>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
