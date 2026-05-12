"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { hotspots } from "@/data/hotspots";
import type { Hotspot } from "@/types/hotspot";
import { DiscoveryHUD } from "@/components/home/DiscoveryHUD";
import { HotspotDetailPanel } from "@/components/home/HotspotDetailPanel";
import { AchievementToast } from "@/components/home/AchievementToast";
import styles from "./InteractiveCover.module.css";

const coverImageSrc = "/images/covers/Copertina_NEW_TQCNTHD.jpg";
const storageKey = "jeec:new-cover-discoveries";

type HotspotStyle = CSSProperties & {
  "--hotspot-left": string;
  "--hotspot-top": string;
  "--hotspot-size": string;
  "--hotspot-opacity": number;
  "--hotspot-shadow": string;
  "--hotspot-ring-opacity": number;
};

export function InteractiveCover() {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    null,
  );
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [achievement, setAchievement] = useState<Hotspot | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [debugPosition, setDebugPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const coverRef = useRef<HTMLDivElement | null>(null);
  const isDebugMode = process.env.NODE_ENV === "development";

  const selectedHotspot = hotspots.find(
    (hotspot) => hotspot.id === selectedHotspotId,
  );

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

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(35);
    }

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

  function handleCoverPointerMove(event: PointerEvent<HTMLDivElement>) {
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

  function handlePointerLeave() {
    setPointerPosition(null);
    setDebugPosition(null);
  }

  function resetArcadeSave() {
    setDiscoveredIds([]);
    setSelectedHotspotId(null);
    window.localStorage.removeItem(storageKey);
  }

  function getHotspotStyle(
    hotspot: Hotspot,
    isDiscovered: boolean,
  ): HotspotStyle {
    const distance = pointerPosition
      ? Math.hypot(pointerPosition.x - hotspot.x, pointerPosition.y - hotspot.y)
      : 100;

    const proximity = Math.max(0, 1 - distance / 18);
    const glow = isDiscovered ? 0.62 : 0.2 + proximity * 0.5;
    const opacity = isDiscovered ? 1 : 0.58 + proximity * 0.32;
    const ringOpacity = isDiscovered ? 0.9 : 0.25 + proximity * 0.5;
    const hotspotSize = Math.max(44, hotspot.radius * 8);

    return {
      "--hotspot-left": `${hotspot.x}%`,
      "--hotspot-top": `${hotspot.y}%`,
      "--hotspot-size": `${hotspotSize}px`,
      "--hotspot-opacity": opacity,
      "--hotspot-ring-opacity": ringOpacity,
      "--hotspot-shadow": `0 0 ${
        10 + proximity * 20
      }px rgba(241, 187, 223, ${glow})`,
    };
  }

  return (
    <section className={styles.root}>
      <DiscoveryHUD hotspots={hotspots} discoveredIds={discoveredIds} />

      {isDebugMode && (
        <button
          type="button"
          onClick={resetArcadeSave}
          className={styles.resetButton}
        >
          Reset Arcade Save
        </button>
      )}

      <div className={styles.frame}>
        <div className={styles.scanlines} />

        <div
          ref={coverRef}
          onPointerMove={handleCoverPointerMove}
          onPointerLeave={handlePointerLeave}
          className={styles.coverViewport}
        >
          <Image
            src={coverImageSrc}
            alt="Copertina NEW (Tutto Quello Che Non Ti Ho Detto)"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 960px"
            className={styles.coverImage}
          />

          {hotspots.map((hotspot) => {
            const isDiscovered = discoveredIds.includes(hotspot.id);

            return (
              <button
                key={hotspot.id}
                type="button"
                aria-label={hotspot.title}
                data-discovered={isDiscovered}
                onClick={() => handleHotspotClick(hotspot)}
                className={styles.hotspot}
                style={getHotspotStyle(hotspot, isDiscovered)}
              >
                <span className={styles.hotspotRing} />
                <span className={styles.hotspotPulse} />
                <span className={styles.hotspotLabel}>
                  {isDiscovered ? "✓" : ""}
                </span>
              </button>
            );
          })}

          {isDebugMode && debugPosition && (
            <div className={styles.debugOverlay}>
              <div>
                x: {debugPosition.x} · y: {debugPosition.y}
              </div>

              <div className={styles.debugHint}>
                closeUpX: {debugPosition.x}, closeUpY: {debugPosition.y}
              </div>
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
