import Image from "next/image";
import type { Hotspot } from "@/types/hotspot";

type DiscoveryHUDProps = {
  hotspots: Hotspot[];
  discoveredIds: string[];
};

export function DiscoveryHUD({ hotspots, discoveredIds }: DiscoveryHUDProps) {
  const discoveredCount = discoveredIds.length;
  const totalCount = hotspots.length;
  const progress = totalCount > 0 ? (discoveredCount / totalCount) * 100 : 0;

  const score = hotspots
    .filter((hotspot) => discoveredIds.includes(hotspot.id))
    .reduce((total, hotspot) => total + hotspot.score, 0);

  return (
    <div className="mb-4 rounded-2xl border border-cyan-300/30 bg-black/80 p-4 font-mono text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
            JEEC Arcade System
          </p>
          <p className="mt-1 text-sm text-white/60">
            Score: <span className="text-cyan-200">{score}</span> XP ·{" "}
            {discoveredCount}/{totalCount} elementi trovati
          </p>
        </div>

        <div className="flex gap-2">
          {hotspots.map((hotspot) => {
            const isDiscovered = discoveredIds.includes(hotspot.id);

            return (
              <div
                key={hotspot.id}
                title={hotspot.title}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  isDiscovered
                    ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
                    : "border-white/10 bg-white/[0.03] text-white/20"
                }`}
              >
                {isDiscovered ? (
                  <Image
                    src={hotspot.badgeIcon}
                    alt={hotspot.shortLabel}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                ) : (
                  <span className="text-xs">?</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}