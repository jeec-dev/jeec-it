import { InteractiveCover } from "@/components/home/InteractiveCover";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--jeec-space-black)] px-6 py-12 text-[var(--jeec-moon-white)]">
      <section className="mx-auto mb-12 max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-[var(--jeec-new-pink)]">
          JEEC ARCADE CABINET
        </p>

        <h1 className="mt-4 text-5xl font-bold text-[var(--jeec-new-pink)] drop-shadow-[0_0_24px_rgba(241,187,223,0.35)]">
          NEW
        </h1>

        <p className="mt-4 text-white/60">
          Esplora la copertina di “Tutto Quello Che Non Ti Ho Detto”. Trova gli
          elementi nascosti, sblocca badge e apri gli specchietti digitali
          collegati alla release.
        </p>
      </section>

      <InteractiveCover />
    </main>
  );
}
