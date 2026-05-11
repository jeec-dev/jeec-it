import { InteractiveCover } from "@/components/home/InteractiveCover";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <section className="mx-auto mb-12 max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">
          JEEC
        </p>

        <h1 className="mt-4 text-5xl font-bold">NEW TQCNTHD</h1>

        <p className="mt-4 text-white/60">
          Esplora la copertina. Alcuni dettagli nascondono frammenti della
          storia.
        </p>
      </section>

      <InteractiveCover />
    </main>
  );
}