"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { hotspots } from "@/data/hotspots";

export function InteractiveCover() {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const activeHotspot = hotspots.find(
    (hotspot) => hotspot.id === activeHotspotId
  );

  return (
    <section className="relative mx-auto max-w-4xl">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl">
        <Image
            src="/images/covers/Copertina_NEW_TQCNTHD.PNG"
            alt="Copertina Diario di Jay"
            fill
            priority
            className="object-cover"
        />

        {hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            type="button"
            aria-label={hotspot.title}
            onClick={() => setActiveHotspotId(hotspot.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition hover:scale-125 hover:bg-white/30"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              width: `${hotspot.radius * 8}px`,
              height: `${hotspot.radius * 8}px`,
            }}
          />
        ))}
      </div>

      {activeHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-white/10 bg-black/80 p-6 text-white"
        >
          <h2 className="text-xl font-semibold">{activeHotspot.title}</h2>
          <p className="mt-2 text-sm text-white/70">{activeHotspot.content}</p>
        </motion.div>
      )}
    </section>
  );
}