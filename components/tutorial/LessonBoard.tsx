import { GomokuBoard } from "@/components/game/GomokuBoard";
import { GAME_SNAPSHOTS } from "@/components/game/snapshots";

/** Embed a board state inside lesson prose (from a snapshot index). */
export function LessonBoard({ snapshot = 0, caption }: { snapshot?: number; caption?: string }) {
  const snap = GAME_SNAPSHOTS[snapshot] ?? GAME_SNAPSHOTS[0];
  return (
    <figure className="my-6 mx-auto w-full max-w-xs">
      <GomokuBoard
        board={snap.board}
        lastMove={snap.last}
        winningLine={snap.winningLine}
        compact
      />
      {caption && (
        <figcaption className="mt-2 text-center font-mono text-[11px] text-[var(--color-faint)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
