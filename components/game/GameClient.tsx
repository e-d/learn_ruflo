"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GomokuBoard } from "./GomokuBoard";
import { useGomoku } from "./useGomoku";
import { useAI } from "./useAI";
import { P1, P2, type Cell } from "./constants";
import { AI_LEVELS, type AILevel } from "./ai/engine";
import { cn } from "@/lib/utils";

type Mode = "2p" | "ai";

export function GameClient() {
  const game = useGomoku();
  const { requestMove, thinking } = useAI();
  const [mode, setMode] = useState<Mode>("ai");
  const [level, setLevel] = useState<AILevel>(2);
  const [aiPlays, setAiPlays] = useState<Cell>(P2);

  const human: Cell = aiPlays === P1 ? P2 : P1;
  const { board, current, status, winner, winningLine, lastMove, moveCount, reset, undo, play } =
    game;

  // AI turn handler
  useEffect(() => {
    if (mode !== "ai" || status !== "playing" || current !== aiPlays) return;
    let cancelled = false;
    requestMove(board, current, level).then((m) => {
      if (!cancelled && m) play(m[0], m[1]);
    });
    return () => {
      cancelled = true;
    };
  }, [mode, status, current, aiPlays, level, board, requestMove, play]);

  const humansTurn = mode === "2p" || current === human;
  const boardLocked = status !== "playing" || (mode === "ai" && (thinking || current === aiPlays));

  const announcement =
    status === "won"
      ? `${stoneName(winner ?? P1)} wins.`
      : status === "draw"
        ? "Draw."
        : lastMove
          ? `Stone at row ${lastMove[0] + 1}, column ${lastMove[1] + 1}. ${stoneName(current)} to move.`
          : `${stoneName(current)} to move.`;

  const restart = (next?: Partial<{ mode: Mode; level: AILevel; aiPlays: Cell }>) => {
    if (next?.mode) setMode(next.mode);
    if (next?.level) setLevel(next.level);
    if (next?.aiPlays) setAiPlays(next.aiPlays);
    reset();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* board */}
      <div className="mx-auto w-full max-w-xl">
        <StatusBar
          status={status}
          winner={winner}
          current={current}
          thinking={thinking && mode === "ai"}
          mode={mode}
          human={human}
        />
        <div className="mt-4">
          <GomokuBoard
            board={board}
            lastMove={lastMove}
            winningLine={winningLine}
            disabled={boardLocked}
            onPlay={humansTurn ? play : undefined}
          />
        </div>
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>

      {/* control panel */}
      <div className="flex flex-col gap-4">
        <Panel title="Opponent">
          <Segmented
            options={[
              { value: "2p", label: "2 Player" },
              { value: "ai", label: "vs AI" },
            ]}
            value={mode}
            onChange={(v) => restart({ mode: v as Mode })}
          />
        </Panel>

        <AnimatePresence initial={false}>
          {mode === "ai" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Panel title="Difficulty">
                <div className="flex flex-col gap-1.5">
                  {AI_LEVELS.map((l) => (
                    <button
                      key={l.level}
                      onClick={() => restart({ level: l.level })}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left transition-colors",
                        level === l.level
                          ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10"
                          : "border-[var(--color-line)] hover:bg-white/5",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {l.level}. {l.name}
                        </span>
                        {level === l.level && (
                          <span className="font-mono text-[10px] text-[var(--color-accent-2)]">
                            active
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">{l.blurb}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <Segmented
                    options={[
                      { value: String(P2), label: "AI plays dark" },
                      { value: String(P1), label: "AI plays light" },
                    ]}
                    value={String(aiPlays)}
                    onChange={(v) => restart({ aiPlays: Number(v) as Cell })}
                  />
                </div>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>

        <Panel title="Game">
          <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
            <span>Moves played</span>
            <span className="font-mono text-[var(--color-ink)]">{moveCount}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => undo(mode === "ai" ? 2 : 1)}
              disabled={moveCount === 0 || thinking}
              className="flex-1 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              ↶ Undo
            </button>
            <button
              onClick={() => reset()}
              className="flex-1 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm transition-colors hover:bg-white/5"
            >
              ↻ Reset
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatusBar({
  status,
  winner,
  current,
  thinking,
  mode,
  human,
}: {
  status: string;
  winner: Cell | null;
  current: Cell;
  thinking: boolean;
  mode: Mode;
  human: Cell;
}) {
  let label: React.ReactNode;
  if (status === "won") {
    const who =
      mode === "ai" ? (winner === human ? "You win!" : "AI wins") : `${stoneName(winner!)} wins`;
    label = <span className="font-semibold text-[var(--color-amber)]">{who} 🎉</span>;
  } else if (status === "draw") {
    label = <span className="font-semibold">Draw</span>;
  } else if (thinking) {
    label = (
      <span className="flex items-center gap-2 text-[var(--color-warm)]">
        <motion.span
          className="h-2 w-2 rounded-full bg-[var(--color-warm)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        AI is thinking…
      </span>
    );
  } else {
    label = (
      <span className="flex items-center gap-2">
        <StoneDot player={current} /> {stoneName(current)} to move
      </span>
    );
  }
  return (
    <div className="glass flex h-12 items-center justify-center rounded-xl text-sm">{label}</div>
  );
}

function stoneName(p: Cell) {
  return p === P1 ? "Light" : "Dark";
}

function StoneDot({ player }: { player: Cell }) {
  return (
    <span
      className={cn(
        "inline-block h-3.5 w-3.5 rounded-full",
        player === P1
          ? "bg-[radial-gradient(circle_at_32%_28%,#fff,#bcb4a6)]"
          : "bg-[radial-gradient(circle_at_32%_28%,#3a3a4d,#0c0c12)] ring-1 ring-[var(--color-accent)]/40",
      )}
    />
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-faint)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg border border-[var(--color-line)] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm transition-colors",
            value === o.value
              ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] text-black"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
