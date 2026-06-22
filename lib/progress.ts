"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "ruflo:progress:v1";

type Stored = { completed: string[]; lastVisited?: string };

function read(): Stored {
  if (typeof window === "undefined") return { completed: [] };
  try {
    return JSON.parse(localStorage.getItem(KEY) || "") as Stored;
  } catch {
    return { completed: [] };
  }
}

function write(data: Stored) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

/**
 * Tutorial progress, persisted to localStorage (no auth needed). Returns a
 * Set of completed lesson slugs plus helpers. SSR-safe: starts empty, hydrates
 * on mount.
 */
export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage once on mount (SSR renders the empty state,
    // so this read can't run earlier without a hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(new Set(read().completed));
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    setCompleted(new Set(next));
    write({ completed: [...next], lastVisited: read().lastVisited });
  }, []);

  const markComplete = useCallback(
    (slug: string) => {
      const next = new Set(read().completed);
      next.add(slug);
      persist(next);
    },
    [persist],
  );

  const toggle = useCallback(
    (slug: string) => {
      const next = new Set(read().completed);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      persist(next);
    },
    [persist],
  );

  const markVisited = useCallback((slug: string) => {
    write({ completed: read().completed, lastVisited: slug });
  }, []);

  return {
    hydrated,
    completed,
    isDone: (slug: string) => completed.has(slug),
    count: completed.size,
    markComplete,
    toggle,
    markVisited,
  };
}
