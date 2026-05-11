"use client";

import Image from "next/image";
import Link from "next/link";
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
          alt="Copertina NEW (Tutto Quello Che Non Ti Ho Detto)"
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
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {activeHotspot.shortLabel} · +{activeHotspot.score} XP
          </p>

          <h2 className="mt-2 text-xl font-semibold">{activeHotspot.title}</h2>

          <p className="mt-2 text-sm text-white/70">
            {activeHotspot.content}
          </p>

          <p className="mt-4 text-sm text-white/50">
            Traccia: {activeHotspot.trackTitle}
          </p>

          {activeHotspot.href && (
            <Link
              href={activeHotspot.href}
              className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white hover:text-white"
            >
              Vai alla scheda nel catalogo
            </Link>
          )}
        </motion.div>
      )}
    </section>
  );
}