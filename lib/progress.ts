"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const KEY = "ruflo:progress:v1";

type Stored = { completed: string[]; lastVisited?: string };

/**
 * A single module-level store shared by every component that calls
 * useProgress, so marking a lesson complete updates the sidebar, footer, and
 * controls instantly — no refresh. Backed by localStorage for persistence.
 */
let completed = new Set<string>();
let lastVisited: string | undefined;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "") as Stored;
    completed = new Set(data.completed ?? []);
    lastVisited = data.lastVisited;
  } catch {
    /* nothing stored yet */
  }
}

function persistAndEmit() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify({ completed: [...completed], lastVisited }));
  }
  listeners.forEach((l) => l());
}

// Load eagerly on the client so the first post-hydration snapshot is correct.
if (typeof window !== "undefined") load();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return completed; // stable reference until a mutation swaps it
}
const SERVER_EMPTY = new Set<string>();
function getServerSnapshot() {
  return SERVER_EMPTY;
}

export function useProgress() {
  const completedSet = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Gate display until after mount to avoid a "0/9" flash before localStorage is read.
  const [hydrated, setHydrated] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), []);

  const markComplete = useCallback((slug: string) => {
    if (completed.has(slug)) return;
    completed = new Set(completed).add(slug);
    persistAndEmit();
  }, []);

  const toggle = useCallback((slug: string) => {
    const next = new Set(completed);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    completed = next;
    persistAndEmit();
  }, []);

  const markVisited = useCallback((slug: string) => {
    lastVisited = slug;
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify({ completed: [...completed], lastVisited }));
    }
  }, []);

  return {
    hydrated,
    completed: completedSet,
    isDone: (slug: string) => completedSet.has(slug),
    count: completedSet.size,
    markComplete,
    toggle,
    markVisited,
  };
}
