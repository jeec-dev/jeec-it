"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Hotspot } from "@/types/hotspot";

type AchievementToastProps = {
  achievement: Hotspot | null;
};

export function AchievementToast({ achievement }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          className="fixed right-6 top-24 z-50 w-[min(360px,calc(100%-3rem))] rounded-2xl border border-fuchsia-300/40 bg-black/90 p-4 font-mono text-white shadow-[0_0_40px_rgba(217,70,239,0.25)] backdrop-blur-md"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-300">
            Achievement Unlocked
          </p>
          <h3 className="mt-2 text-lg font-bold">{achievement.title}</h3>
          <p className="mt-1 text-sm text-white/60">
            +{achievement.score} XP · {achievement.shortLabel}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}