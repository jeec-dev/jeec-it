import Link from "next/link";
import type { Hotspot } from "@/types/hotspot";

type HotspotDetailPanelProps = {
  hotspot: Hotspot;
  onClose: () => void;
};

export function HotspotDetailPanel({
  hotspot,
  onClose,
}: HotspotDetailPanelProps) {
  return (
    <aside className="absolute bottom-4 right-4 top-4 z-20 w-[min(360px,calc(100%-2rem))] rounded-2xl border border-cyan-300/40 bg-black/85 p-5 font-mono text-white shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
            Inspect Mode
          </p>
          <h2 className="mt-2 text-2xl font-bold text-cyan-100">
            {hotspot.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 transition hover:border-white hover:text-white"
        >
          ESC
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Track
        </p>
        <p className="mt-2 text-sm text-white/80">{hotspot.trackTitle}</p>
      </div>

      <p className="mt-5 text-sm leading-6 text-white/70">{hotspot.content}</p>

      {hotspot.playerUrl ? (
        <iframe
          src={hotspot.playerUrl}
          className="mt-5 h-24 w-full rounded-xl border border-white/10"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/40">
          Player non ancora collegato.
        </div>
      )}

      {hotspot.href && (
        <Link
          href={hotspot.href}
          className="mt-5 inline-flex rounded-full border border-cyan-300/40 px-4 py-2 text-sm text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/10"
        >
          Apri scheda catalogo
        </Link>
      )}
    </aside>
  );
}