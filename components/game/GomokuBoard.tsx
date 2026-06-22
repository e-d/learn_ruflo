"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import {
  SIZE,
  EMPTY,
  STAR_POINTS,
  type Cell,
} from "./constants";
import { Stone } from "./Stone";
import { cn } from "@/lib/utils";

const SPAN = SIZE - 1; // 0..14 intersection grid
const pct = (n: number) => `${(n / SPAN) * 100}%`;
const STONE_PCT = (100 / SPAN) * 0.84; // stone diameter as % of inner box

export type BoardProps = {
  board: Cell[];
  lastMove?: readonly [number, number] | null;
  winningLine?: ReadonlyArray<readonly [number, number]> | null;
  /** When provided, cells become clickable. */
  onPlay?: (r: number, c: number) => void;
  /** Disable input (e.g. while the AI thinks, or game over). */
  disabled?: boolean;
  className?: string;
  /** smaller, non-interactive rendering for the "game so far" panel */
  compact?: boolean;
};

export function GomokuBoard({
  board,
  lastMove,
  winningLine,
  onPlay,
  disabled = false,
  className,
  compact = false,
}: BoardProps) {
  const interactive = !!onPlay && !disabled;
  const winSet = useMemo(
    () => new Set((winningLine ?? []).map(([r, c]) => r * SIZE + c)),
    [winningLine],
  );

  return (
    <div
      className={cn(
        "relative aspect-square w-full select-none rounded-2xl",
        // warm "goban" surface that still belongs to the dark theme
        "bg-[radial-gradient(120%_120%_at_30%_20%,#2a2620,#1c1a16_60%,#141210)]",
        "border border-[var(--color-line)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_20px_60px_-20px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {/* inner box inset so edge intersections have margin */}
      <div className="absolute inset-[5.5%]">
        {/* grid lines + star points */}
        <svg
          viewBox={`0 0 ${SPAN} ${SPAN}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {Array.from({ length: SIZE }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={i}
              x2={SPAN}
              y2={i}
              stroke="rgba(255,255,255,0.16)"
              strokeWidth={0.03}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {Array.from({ length: SIZE }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={i}
              y1={0}
              x2={i}
              y2={SPAN}
              stroke="rgba(255,255,255,0.16)"
              strokeWidth={0.03}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {STAR_POINTS.map(([r, c]) => (
            <circle key={`s${r}-${c}`} cx={c} cy={r} r={0.12} fill="rgba(255,255,255,0.35)" />
          ))}
        </svg>

        {/* stones */}
        {board.map((cell, i) => {
          if (cell === EMPTY) return null;
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          const isLast = !!lastMove && lastMove[0] === r && lastMove[1] === c;
          return (
            <div
              key={`stone-${i}`}
              className="absolute"
              style={{
                left: pct(c),
                top: pct(r),
                width: `${STONE_PCT}%`,
                aspectRatio: "1 / 1",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Stone player={cell} last={isLast} win={winSet.has(i)} animate={!compact} />
            </div>
          );
        })}

        {/* animated winning line */}
        {winningLine && winningLine.length >= 2 && (
          <svg
            viewBox={`0 0 ${SPAN} ${SPAN}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <motion.line
              x1={winningLine[0][1]}
              y1={winningLine[0][0]}
              x2={winningLine[winningLine.length - 1][1]}
              y2={winningLine[winningLine.length - 1][0]}
              stroke="var(--color-amber)"
              strokeWidth={0.12}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            />
          </svg>
        )}

        {/* interaction overlay (keyboard-navigable grid) */}
        {interactive && (
          <div role="grid" aria-label="Gomoku board" className="absolute inset-0">
            {board.map((cell, i) => {
              const r = Math.floor(i / SIZE);
              const c = i % SIZE;
              const filled = cell !== EMPTY;
              return (
                <button
                  key={`cell-${i}`}
                  role="gridcell"
                  aria-label={`Row ${r + 1}, column ${c + 1}${
                    filled ? (cell === 1 ? ", light stone" : ", dark stone") : ", empty"
                  }`}
                  disabled={filled}
                  onClick={() => onPlay?.(r, c)}
                  className={cn(
                    "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                    !filled && "cursor-pointer hover:bg-white/0",
                  )}
                  style={{ left: pct(c), top: pct(r), width: `${STONE_PCT}%`, aspectRatio: "1/1" }}
                >
                  {!filled && (
                    <span className="block h-full w-full scale-90 rounded-full bg-[var(--color-accent)]/0 transition group-hover:bg-[var(--color-accent)]/25" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
