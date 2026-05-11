import Image from "next/image";
import type { Hotspot } from "@/types/hotspot";
import { cn } from "@/lib/ui";

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
    <div className="arcade-panel mb-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="arcade-label">JEEC Arcade System</p>

          <p className="mt-1 text-sm text-white/60">
            Score: <span className="text-[var(--jeec-new-pink)]">{score}</span>{" "}
            XP · {discoveredCount}/{totalCount} elementi trovati
          </p>
        </div>

        <div className="flex gap-2">
          {hotspots.map((hotspot) => {
            const isDiscovered = discoveredIds.includes(hotspot.id);

            return (
              <div
                key={hotspot.id}
                title={hotspot.title}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border",
                  isDiscovered
                    ? "border-[#f1bbdf]/60 bg-[#f1bbdf]/10 text-[#f9ebf4] shadow-[0_0_18px_rgba(241,187,223,0.28)]"
                    : "border-white/10 bg-white/[0.03] text-white/20",
                )}
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
          className="h-full rounded-full bg-gradient-to-r from-[#5b4581] via-[#cd95c9] to-[#f1bbdf] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
