"use client";

import Image from "next/image";
import { useState } from "react";
import { hotspots } from "@/data/hotspots";
import type { Hotspot } from "@/types/hotspot";
import { DiscoveryHUD } from "@/components/home/DiscoveryHUD";
import { HotspotDetailPanel } from "@/components/home/HotspotDetailPanel";
import { AchievementToast } from "@/components/home/AchievementToast";

export function InteractiveCover() {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    null
  );
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [achievement, setAchievement] = useState<Hotspot | null>(null);

  const selectedHotspot = hotspots.find(
    (hotspot) => hotspot.id === selectedHotspotId
  );

  function handleHotspotClick(hotspot: Hotspot) {
    setSelectedHotspotId(hotspot.id);

    const alreadyDiscovered = discoveredIds.includes(hotspot.id);

    if (!alreadyDiscovered) {
      setDiscoveredIds((current) => [...current, hotspot.id]);
      setAchievement(hotspot);

      window.setTimeout(() => {
        setAchievement(null);
      }, 3000);
    }
  }

  return (
    <section className="relative mx-auto max-w-5xl">
      <DiscoveryHUD hotspots={hotspots} discoveredIds={discoveredIds} />

      <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-neutral-950 p-3 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_4px] opacity-25" />

        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900">
          <Image
            src="/images/covers/Copertina_NEW_TQCNTHD.PNG"
            alt="Copertina NEW (Tutto Quello Che Non Ti Ho Detto)"
            fill
            priority
            className="object-cover"
          />

          {hotspots.map((hotspot) => {
            const isDiscovered = discoveredIds.includes(hotspot.id);

            return (
              <button
                key={hotspot.id}
                type="button"
                aria-label={hotspot.title}
                onClick={() => handleHotspotClick(hotspot)}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border font-mono text-[10px] transition hover:scale-125 ${
                  isDiscovered
                    ? "border-cyan-300 bg-cyan-300/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                    : "border-white/30 bg-black/30 text-white/70 backdrop-blur-sm hover:border-fuchsia-300 hover:bg-fuchsia-300/20"
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.radius * 8}px`,
                  height: `${hotspot.radius * 8}px`,
                }}
              >
                {isDiscovered ? "✓" : ""}
              </button>
            );
          })}

          {selectedHotspot && (
            <HotspotDetailPanel
              hotspot={selectedHotspot}
              onClose={() => setSelectedHotspotId(null)}
            />
          )}
        </div>
      </div>

      <AchievementToast achievement={achievement} />
    </section>
  );
}