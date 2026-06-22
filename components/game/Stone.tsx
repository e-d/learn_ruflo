"use client";

import { motion } from "motion/react";
import type { Cell } from "./constants";
import { P1 } from "./constants";
import { cn } from "@/lib/utils";

/**
 * A single Gomoku stone. Animates in with a spring "drop" (transform + opacity
 * only, so it composites on the GPU). Reduced-motion is handled globally by
 * MotionConfig, which neutralizes the transform animation automatically.
 *
 * Colorblind-safe: the two players differ by lightness AND a glyph, not hue.
 */
export function Stone({
  player,
  last = false,
  win = false,
  animate = true,
}: {
  player: Cell;
  last?: boolean;
  win?: boolean;
  animate?: boolean;
}) {
  const isLight = player === P1;
  return (
    <motion.div
      initial={animate ? { scale: 0, y: "-30%", opacity: 0 } : false}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 600, damping: 26, mass: 0.6 }}
      className={cn(
        "relative h-full w-full rounded-full will-change-transform",
        isLight
          ? "bg-[radial-gradient(circle_at_32%_28%,#ffffff,#e7e1d6_55%,#bcb4a6)] shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
          : "bg-[radial-gradient(circle_at_32%_28%,#3a3a4d,#191922_60%,#0c0c12)] shadow-[0_2px_6px_rgba(0,0,0,0.7)]",
      )}
    >
      {/* subtle rim so dark stones read on the dark board */}
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          isLight ? "ring-1 ring-black/10" : "ring-1 ring-[var(--color-accent)]/35",
        )}
      />
      {/* last-move marker */}
      {last && (
        <motion.span
          layoutId="last-move"
          className="absolute inset-0 rounded-full ring-2 ring-[var(--color-accent-2)] ring-offset-0"
        />
      )}
      {/* win pulse */}
      {win && (
        <motion.span
          className="absolute -inset-1 rounded-full ring-2 ring-[var(--color-amber)]"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}
