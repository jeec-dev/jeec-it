import Image from "next/image";
import type { Hotspot } from "@/types/hotspot";
import styles from "./DiscoveryHUD.module.css";

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
    <div className={styles.hud}>
      <div className={styles.inner}>
        <div>
          <p className={styles.label}>JEEC Arcade System</p>

          <p className={styles.meta}>
            Score: <span className={styles.score}>{score}</span> XP ·{" "}
            {discoveredCount}/{totalCount} elementi trovati
          </p>
        </div>

        <div className={styles.badges}>
          {hotspots.map((hotspot) => {
            const isDiscovered = discoveredIds.includes(hotspot.id);

            return (
              <div
                key={hotspot.id}
                title={hotspot.title}
                className={styles.badge}
                data-discovered={isDiscovered}
              >
                {isDiscovered ? (
                  <Image
                    src={hotspot.badgeIcon}
                    alt={hotspot.shortLabel}
                    width={24}
                    height={24}
                    className={styles.badgeIcon}
                  />
                ) : (
                  <span className={styles.locked}>?</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
