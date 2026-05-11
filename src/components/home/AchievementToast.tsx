"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Hotspot } from "@/types/hotspot";
import styles from "./AchievementToast.module.css";

type AchievementToastProps = {
  achievement: Hotspot | null;
};

export function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className={styles.toast}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className={styles.scanline}
          />

          <p className={styles.label}>Achievement Unlocked</p>

          <h3 className={styles.title}>{achievement.title}</h3>

          <p className={styles.meta}>
            +{achievement.score} XP · {achievement.shortLabel}
          </p>

          <div className={styles.timerTrack}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.6, ease: "linear" }}
              className={styles.timerFill}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
