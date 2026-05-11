"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hotspots } from "@/data/hotspots";
import type { Hotspot } from "@/types/hotspot";
import { DiscoveryHUD } from "@/components/home/DiscoveryHUD";
import { HotspotDetailPanel } from "@/components/home/HotspotDetailPanel";
import { AchievementToast } from "@/components/home/AchievementToast";

const coverImageSrc = "/images/covers/Copertina_NEW_TQCNTHD.PNG";
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

  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

    if (alreadyDiscovered) {
      return;
    }

    const nextDiscoveredIds = [...discoveredIds, hotspot.id];

    setDiscoveredIds(nextDiscoveredIds);
    window.localStorage.setItem(storageKey, JSON.stringify(nextDiscoveredIds));

    setAchievement(hotspot);

    window.setTimeout(() => {
      setAchievement(null);
    }, 3000);
  }

  function handleCoverPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!coverRef.current) {
      return;
    }

    const rect = coverRef.current.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const nextPosition = {
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
    };

    setPointerPosition(nextPosition);

    if (isDebugMode) {
      setDebugPosition(nextPosition);
    }
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
          onPointerMove={handleCoverPointerMove}
          onPointerLeave={() => {
            setDebugPosition(null);
            setPointerPosition(null);
          }}
          className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900"
        >
          <Image
            src={coverImageSrc}
            alt="Copertina NEW (Tutto Quello Che Non Ti Ho Detto)"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 960px"
            className="object-cover"
          />

          {hotspots.map((hotspot) => {
            const isDiscovered = discoveredIds.includes(hotspot.id);
            const distance = pointerPosition
              ? Math.hypot(
                  pointerPosition.x - hotspot.x,
                  pointerPosition.y - hotspot.y,
                )
              : 100;

            const proximity = Math.max(0, 1 - distance / 18);
            const glow = isDiscovered ? 0.62 : 0.2 + proximity * 0.5;
            const opacity = isDiscovered ? 1 : 0.58 + proximity * 0.32;
            const ringOpacity = isDiscovered ? 0.9 : 0.25 + proximity * 0.5;

            return (
              <button
                key={hotspot.id}
                type="button"
                aria-label={hotspot.title}
                onClick={() => handleHotspotClick(hotspot)}
                className={`group absolute z-20 rounded-full border font-mono text-[10px] transition-[opacity,box-shadow,border-color,background-color] duration-200 active:scale-90 ${
                  isDiscovered
                    ? "border-[#f1bbdf] bg-[#f1bbdf]/20 text-[#f9ebf4]"
                    : "border-[#f9ebf4]/30 bg-black/30 text-[#f9ebf4]/70 backdrop-blur-sm hover:border-[#f1bbdf] hover:bg-[#cd95c9]/20"
                }`}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${Math.max(44, hotspot.radius * 8)}px`,
                  height: `${Math.max(44, hotspot.radius * 8)}px`,
                  opacity,
                  transform: "translate(-50%, -50%)",
                  boxShadow: `0 0 ${10 + proximity * 20}px rgba(241, 187, 223, ${glow})`,
                }}
              >
                <span
                  className="pointer-events-none absolute inset-[-6px] rounded-full border border-[#f1bbdf] transition-opacity duration-200"
                  style={{ opacity: ringOpacity }}
                />

                <span className="pointer-events-none absolute inset-0 rounded-full bg-[#f1bbdf]/10 opacity-0 transition-opacity duration-200 group-active:opacity-100" />

                <span className="relative z-10">{isDiscovered ? "✓" : ""}</span>
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
              closeUpImageSrc={coverImageSrc}
              onClose={() => setSelectedHotspotId(null)}
            />
          )}
        </div>
      </div>

      <AchievementToast achievement={achievement} />
    </section>
  );
}
