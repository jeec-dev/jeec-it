import Link from "next/link";
import { InteractiveCover } from "@/components/home/InteractiveCover";
import { getLiveEvents } from "@/lib/events/events";

function formatEventDate(startsAt: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(startsAt));
}

export default async function HomePage() {
  const events = await getLiveEvents();
  const now = new Date();

  const nextEvent = events
    .filter((event) => new Date(event.startsAt).getTime() >= now.getTime())
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    )[0];

  return (
    <main className="min-h-screen bg-[var(--jeec-space-black)] px-6 py-12 text-[var(--jeec-moon-white)]">
      <section className="mx-auto mb-12 max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--jeec-new-pink)]">
          JEEC ARCADE CABINET
        </p>

        <h1 className="mt-4 text-5xl font-black text-[var(--jeec-new-pink)] drop-shadow-[0_0_24px_rgba(241,187,223,0.35)] md:text-7xl">
          NEW
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-white/60">
          Esplora la copertina di “Tutto Quello Che Non Ti Ho Detto”. Trova gli
          elementi nascosti, sblocca badge e apri gli specchietti digitali
          collegati alla release.
        </p>
      </section>

      <InteractiveCover />

      <section className="mx-auto mt-20 grid max-w-6xl gap-4 md:grid-cols-3">
        <Link
          href="/musica/new-tutto-quello-che-non-ti-ho-detto"
          className="group rounded-3xl border border-[rgb(241_187_223_/_0.22)] bg-[rgb(241_187_223_/_0.06)] p-6 text-decoration-none shadow-[0_1.5rem_4rem_rgb(0_0_0_/_0.22)] transition hover:-translate-y-1 hover:border-[rgb(241_187_223_/_0.42)] hover:bg-[rgb(241_187_223_/_0.09)]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--jeec-new-pink)]">
            Release principale
          </p>
          <h2 className="mt-4 text-3xl font-black leading-none tracking-[-0.05em]">
            Ascolta NEW
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Deluxe edition, tracce remastered, bonus track, player e dettagli
            del progetto.
          </p>
          <span className="mt-6 inline-flex rounded-full border border-[rgb(241_187_223_/_0.3)] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--jeec-new-pink)]">
            Apri release
          </span>
        </Link>

        <Link
          href="/diario-di-jay"
          className="group rounded-3xl border border-[rgb(125_247_240_/_0.2)] bg-[rgb(6_31_42_/_0.42)] p-6 text-decoration-none shadow-[0_1.5rem_4rem_rgb(0_0_0_/_0.22)] transition hover:-translate-y-1 hover:border-[rgb(125_247_240_/_0.38)] hover:bg-[rgb(6_31_42_/_0.58)]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--jeec-cyan-glow)]">
            Lore transmission
          </p>
          <h2 className="mt-4 text-3xl font-black leading-none tracking-[-0.05em]">
            Diario di Jay
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Frammenti narrativi, capitoli e segnali fuori tempo dall’universo di
            Jay.
          </p>
          <span className="mt-6 inline-flex rounded-full border border-[rgb(125_247_240_/_0.3)] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--jeec-cyan-ice)]">
            Leggi diario
          </span>
        </Link>

        <Link
          href="/eventi"
          className="group rounded-3xl border border-[rgb(125_247_240_/_0.2)] bg-[rgb(6_31_42_/_0.42)] p-6 text-decoration-none shadow-[0_1.5rem_4rem_rgb(0_0_0_/_0.22)] transition hover:-translate-y-1 hover:border-[rgb(125_247_240_/_0.38)] hover:bg-[rgb(6_31_42_/_0.58)]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--jeec-cyan-glow)]">
            Live coordinates
          </p>
          <h2 className="mt-4 text-3xl font-black leading-none tracking-[-0.05em]">
            {nextEvent ? "Prossima data" : "Eventi"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            {nextEvent
              ? `${formatEventDate(nextEvent.startsAt)}${
                  nextEvent.city ? ` · ${nextEvent.city}` : ""
                }`
              : "Date live, archivio eventi, biglietti e coordinate aggiornate da Bandsintown."}
          </p>
          <span className="mt-6 inline-flex rounded-full border border-[rgb(125_247_240_/_0.3)] px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--jeec-cyan-ice)]">
            Vedi eventi
          </span>
        </Link>
      </section>

      <section className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-2">
        <Link
          href="/musica"
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[rgb(241_187_223_/_0.32)] hover:bg-[rgb(241_187_223_/_0.06)]"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
            Catalogo
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
            Tutta la musica
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/58">
            Album, singoli, tracce, credits, lyrics embed, player e connessioni
            tra release.
          </p>
        </Link>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/media-kit"
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[rgb(125_247_240_/_0.3)] hover:bg-[rgb(6_31_42_/_0.42)]"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
              Press
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
              Media Kit
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/58">
              Bio, materiali e riferimenti rapidi.
            </p>
          </Link>

          <Link
            href="/contatti"
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[rgb(125_247_240_/_0.3)] hover:bg-[rgb(6_31_42_/_0.42)]"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
              Booking
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">
              Contatti
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/58">
              Booking, press, collaborazioni e richieste.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
