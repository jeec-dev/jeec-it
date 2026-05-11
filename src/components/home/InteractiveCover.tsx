"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hotspots } from "@/data/hotspots";
import type { Hotspot } from "@/types/hotspot";
import { DiscoveryHUD } from "@/components/home/DiscoveryHUD";
import { HotspotDetailPanel } from "@/components/home/HotspotDetailPanel";
import { AchievementToast } from "@/components/home/AchievementToast";

const storageKey = "jeec:new-cover-discoveries";

export function InteractiveCover() {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    null,
  );

  const coverRef = useRef<HTMLDivElement | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [achievement, setAchievement] = useState<Hotspot | null>(null);

  const selectedHotspot = hotspots.find(
    (hotspot) => hotspot.id === selectedHotspotId,
  );

  const [debugPosition, setDebugPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const isDebugMode = process.env.NODE_ENV === "development";

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const storedValue = window.localStorage.getItem(storageKey);

      if (!storedValue) {
        return;
      }

      try {
        const parsedValue = JSON.parse(storedValue);

        if (Array.isArray(parsedValue)) {
          setDiscoveredIds(
            parsedValue.filter(
              (item): item is string => typeof item === "string",
            ),
          );
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    });
  }, []);

  function handleHotspotClick(hotspot: Hotspot) {
    setSelectedHotspotId(hotspot.id);

    const alreadyDiscovered = discoveredIds.includes(hotspot.id);

    if (!alreadyDiscovered) {
      const nextDiscoveredIds = [...discoveredIds, hotspot.id];

      setDiscoveredIds(nextDiscoveredIds);
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(nextDiscoveredIds),
      );

      setAchievement(hotspot);

      window.setTimeout(() => {
        setAchievement(null);
      }, 3000);
    }
  }

  function handleDebugPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDebugMode || !coverRef.current) {
      return;
    }

    const rect = coverRef.current.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setDebugPosition({
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
    });
  }

  return (
    <section className="relative mx-auto max-w-5xl">
      <DiscoveryHUD hotspots={hotspots} discoveredIds={discoveredIds} />

      <button
        type="button"
        onClick={() => {
          setDiscoveredIds([]);
          setSelectedHotspotId(null);
          window.localStorage.removeItem(storageKey);
        }}
        className="mb-4 rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-white/40 transition hover:border-white/30 hover:text-white"
      >
        Reset Arcade Save
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-[#f1bbdf]/25 bg-[var(--jeec-deep-violet)] p-3 shadow-[0_0_70px_rgba(205,149,201,0.20)]">
        <div className="arcade-scanlines" />
        <div
          ref={coverRef}
          onPointerMove={handleDebugPointerMove}
          onPointerLeave={() => setDebugPosition(null)}
          className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900"
        >
          <Image
            src="/images/covers/Copertina_NEW_TQCNTHD.PNG"
            alt="Copertina NEW (Tutto Quello Che Non Ti Ho Detto)"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 960px"
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
                    ? "border-[#f1bbdf] bg-[#f1bbdf]/20 text-[#f9ebf4] shadow-[0_0_22px_rgba(241,187,223,0.65)]"
                    : "border-[#f9ebf4]/30 bg-black/30 text-[#f9ebf4]/70 backdrop-blur-sm hover:border-[#f1bbdf] hover:bg-[#cd95c9]/20"
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

          {isDebugMode && debugPosition && (
            <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-xl border border-[#f1bbdf]/40 bg-[#0c0a19]/85 px-3 py-2 font-mono text-xs text-[#f9ebf4] shadow-[0_0_20px_rgba(241,187,223,0.25)] backdrop-blur-md">
              x: {debugPosition.x} · y: {debugPosition.y}
            </div>
          )}

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
