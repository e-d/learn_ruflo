"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Cell } from "./constants";
import type { Coord } from "./engine";
import { chooseMove, type AILevel } from "./ai/engine";

const MIN_THINK_MS = 350; // a floor so instant moves don't feel jarring

/**
 * Drives the AI engine. Levels 3+ run in a Web Worker so the UI never freezes;
 * if the worker can't be created, it transparently falls back to the main
 * thread. Exposes a `thinking` flag for the UI.
 */
export function useAI() {
  const workerRef = useRef<Worker | null>(null);
  const pending = useRef(new Map<number, (c: Coord) => void>());
  const reqId = useRef(0);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    try {
      const w = new Worker(new URL("./ai/worker.ts", import.meta.url), { type: "module" });
      w.onmessage = (e: MessageEvent<{ move: Coord; reqId: number }>) => {
        const resolve = pending.current.get(e.data.reqId);
        if (resolve) {
          pending.current.delete(e.data.reqId);
          resolve(e.data.move);
        }
      };
      workerRef.current = w;
      return () => w.terminate();
    } catch {
      workerRef.current = null; // fall back to main thread
    }
  }, []);

  const requestMove = useCallback(
    (board: Cell[], player: Cell, level: AILevel): Promise<Coord> => {
      setThinking(true);
      const start = Date.now();
      const settle = (move: Coord, resolve: (c: Coord) => void) => {
        const wait = Math.max(0, MIN_THINK_MS - (Date.now() - start));
        window.setTimeout(() => {
          setThinking(false);
          resolve(move);
        }, wait);
      };

      return new Promise<Coord>((resolve) => {
        const w = workerRef.current;
        if (w) {
          const id = ++reqId.current;
          pending.current.set(id, (move) => settle(move, resolve));
          w.postMessage({ board, player, level, reqId: id });
        } else {
          // main-thread fallback — defer a tick so React can paint "thinking"
          window.setTimeout(() => settle(chooseMove(board, player, level), resolve), 0);
        }
      });
    },
    [],
  );

  return { requestMove, thinking };
}
