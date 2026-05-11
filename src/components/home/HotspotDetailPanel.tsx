import Image from "next/image";
import Link from "next/link";
import type { Hotspot } from "@/types/hotspot";

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
    <aside className="arcade-panel-strong absolute inset-x-3 bottom-3 z-30 max-h-[72%] overflow-y-auto p-4 sm:bottom-4 sm:right-4 sm:left-auto sm:top-4 sm:w-[min(380px,calc(100%-2rem))] sm:max-h-none sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="arcade-label">Inspect Mode</p>

          <h2 className="mt-2 text-2xl font-bold text-[var(--jeec-new-pink)] drop-shadow-[0_0_18px_rgba(241,187,223,0.35)]">
            {hotspot.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="min-h-10 min-w-10 rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 transition active:scale-95 hover:border-white hover:text-white"
          aria-label="Chiudi pannello dettaglio"
        >
          ESC
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#f1bbdf]/30 bg-[#0c0a19] shadow-[0_0_24px_rgba(241,187,223,0.16)]">
        <div className="relative aspect-square overflow-hidden bg-[#0c0a19]">
          <div
            className="absolute"
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
              className="object-cover"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_45%,rgba(12,10,25,0.72)_100%)]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f1bbdf]/80 shadow-[0_0_22px_rgba(241,187,223,0.55)]" />

          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-[#f1bbdf]/30 bg-[#0c0a19]/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f1bbdf]/80">
            Close Scan
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Track
        </p>

        <p className="mt-2 text-sm text-[var(--jeec-moon-white)]">
          {hotspot.trackTitle}
        </p>
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
        <Link href={hotspot.href} className="arcade-button mt-5 inline-flex">
          Apri scheda catalogo
        </Link>
      )}
    </aside>
  );
}
