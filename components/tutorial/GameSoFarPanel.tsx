import { GomokuBoard } from "@/components/game/GomokuBoard";
import { GAME_SNAPSHOTS } from "@/components/game/snapshots";
import type { Lesson } from "@/content/lessons.config";

/**
 * The signature feature: a compact board showing the cumulative state of the
 * game as built up to this lesson, so "we're building a game" stays concrete.
 */
export function GameSoFarPanel({ lesson }: { lesson: Lesson }) {
  const snap = GAME_SNAPSHOTS[lesson.boardSnapshot] ?? GAME_SNAPSHOTS[0];
  return (
    <div className="glass sticky top-20 rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-faint)]">
          your game so far
        </span>
        <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-[var(--color-accent-2)]">
          L{lesson.number.toString().padStart(2, "0")}
        </span>
      </div>
      <GomokuBoard
        board={snap.board}
        lastMove={snap.last}
        winningLine={snap.winningLine}
        compact
      />
      <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
        <span className="text-[var(--color-accent)]">▹ {lesson.ruflo}</span>
        <br />
        <span className="text-[var(--color-faint)]">✦ {lesson.builds}</span>
      </p>
    </div>
  );
}
