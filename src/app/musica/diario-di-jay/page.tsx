import Link from "next/link";
import { diaryEntries } from "@/lib/diary";

export default function DiaryPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.4em] text-white/40">
          Lore
        </p>

        <h1 className="mt-3 text-5xl font-bold">Diario di Jay</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Frammenti narrativi dall’universo dell’album. Alcuni capitoli possono
          essere collegati a tracce, immagini o dettagli nascosti nella home.
        </p>

        <div className="mt-10 grid gap-4">
          {diaryEntries.map((entry) => (
            <Link
              key={entry.metadata.slug}
              href={`/musica/diario-di-jay/${entry.metadata.slug}`}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/30 hover:bg-white/[0.06]"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Capitolo {entry.metadata.chapter}
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {entry.metadata.title}
              </h2>

              <p className="mt-3 text-white/60">{entry.metadata.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}