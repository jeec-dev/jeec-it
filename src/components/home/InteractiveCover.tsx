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

type HotspotStyle = CSSProperties & {
  "--hotspot-left": string;
  "--hotspot-top": string;
  "--hotspot-size": string;
  "--hotspot-opacity": number;
  "--hotspot-shadow": string;
  "--hotspot-ring-opacity": number;
};

const coverImageSrc = "/images/covers/Copertina_NEW_TQCNTHD.jpg";
const storageKey = "jeec:new-cover-discoveries";
const finalRewardClaimedKey = "jeec:new-cover-final-reward-claimed";
const finalRewardUnlockedKey = "jeec:new-cover-final-reward-unlocked";

const FINAL_REWARD = {
  requiredXp: 1970,
  downloadUrl: "/downloads/jeec-new-digital-copy.zip",
  fileName: "JeeC-NEW-Digital-Copy.zip",
};

export function InteractiveCover() {
  const [isRewardSequencePlaying, setIsRewardSequencePlaying] = useState(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(
    null,
  );
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [achievement, setAchievement] = useState<Hotspot | null>(null);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [hasClaimedFinalReward, setHasClaimedFinalReward] = useState(false);
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

  const selectedPanelSide =
    selectedHotspot && selectedHotspot.x >= 50 ? "left" : "right";

  const score = discoveredIds.reduce((total, hotspotId) => {
    const hotspot = hotspots.find((item) => item.id === hotspotId);

    return total + (hotspot?.score ?? 0);
  }, 0);

  const allBadgesFound = discoveredIds.length === hotspots.length;
  const canClaimFinalReward =
    allBadgesFound &&
    score >= FINAL_REWARD.requiredXp &&
    !hasClaimedFinalReward;

  useEffect(() => {
    if (!canClaimFinalReward) {
      return;
    }

    const alreadyUnlocked = window.localStorage.getItem(finalRewardUnlockedKey);

    if (alreadyUnlocked === "true") {
      return;
    }

    window.localStorage.setItem(finalRewardUnlockedKey, "true");
    setSelectedHotspotId(null);
    setIsRewardSequencePlaying(true);

    const timeoutId = window.setTimeout(() => {
      setIsRewardSequencePlaying(false);
      setIsRewardDialogOpen(true);
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canClaimFinalReward]);

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

  function claimFinalReward() {
    if (!canClaimFinalReward) {
      return;
    }

    window.localStorage.setItem(finalRewardClaimedKey, "true");
    setHasClaimedFinalReward(true);
    setIsRewardDialogOpen(false);

    const link = document.createElement("a");
    link.href = FINAL_REWARD.downloadUrl;
    link.download = FINAL_REWARD.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function resetArcadeSave() {
    setDiscoveredIds([]);
    setSelectedHotspotId(null);
    setHasClaimedFinalReward(false);
    setIsRewardDialogOpen(false);
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(finalRewardClaimedKey);
    window.localStorage.removeItem(finalRewardUnlockedKey);
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

      {canClaimFinalReward ? (
        <button
          type="button"
          className={styles.rewardUnlockedButton}
          onClick={() => setIsRewardDialogOpen(true)}
        >
          Reward unlocked · Scarica copia digitale
        </button>
      ) : null}

      {hasClaimedFinalReward ? (
        <p className={styles.rewardClaimed}>
          Digital copy claimed · NEW archive unlocked
        </p>
      ) : null}

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
              panelSide={selectedPanelSide}
              onClose={() => setSelectedHotspotId(null)}
            />
          )}
        </div>
      </div>

      {isRewardSequencePlaying ? (
        <div className={styles.winOverlay} role="status" aria-live="polite">
          <div className={styles.winDialog}>
            <div className={styles.winBadge}>13/13</div>
            <p className={styles.winKicker}>Arcade clear</p>
            <h2>NEW archive unlocked</h2>
            <p>Conversione XP in corso...</p>

            <div className={styles.winProgressTrack}>
              <div className={styles.winProgressFill} />
            </div>
          </div>
        </div>
      ) : null}

      {isRewardDialogOpen ? (
        <div className={styles.rewardOverlay} role="dialog" aria-modal="true">
          <div className={styles.rewardDialog}>
            <p className={styles.rewardKicker}>Final reward unlocked</p>

            <h2>Hai trovato tutti i frammenti di NEW.</h2>

            <p>
              Hai completato l’arcade cabinet e raccolto abbastanza esperienza
              per convertire il tuo punteggio in una copia digitale gratuita
              dell’album.
            </p>

            <div className={styles.rewardStats}>
              <span>
                Badge trovati: {discoveredIds.length}/{hotspots.length}
              </span>
              <span>XP disponibili: {score}</span>
              <span>Costo ricompensa: {FINAL_REWARD.requiredXp} XP</span>
            </div>

            <div className={styles.rewardActions}>
              <button
                type="button"
                className={styles.rewardPrimary}
                onClick={claimFinalReward}
              >
                Spendi XP e scarica album
              </button>

              <button
                type="button"
                className={styles.rewardSecondary}
                onClick={() => setIsRewardDialogOpen(false)}
              >
                Più tardi
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AchievementToast achievement={achievement} />
    </section>
  );
}
