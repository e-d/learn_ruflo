"use client";

import { MotionConfig } from "motion/react";

/**
 * Wraps the app in a single MotionConfig so every animation respects the
 * user's OS "Reduce Motion" setting. (Server layouts can't use context-based
 * client components directly, hence this thin client boundary.)
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
