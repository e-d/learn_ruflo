import { GomokuBoard } from "@/components/game/GomokuBoard";
import { GAME_SNAPSHOTS } from "@/components/game/snapshots";

/**
 * "✅ You should now see this" — the reassurance pattern for build-along
 * tutorials. Optionally renders the board state the learner should have.
 */
export function Checkpoint({
  children,
  snapshot,
}: {
  children: React.ReactNode;
  snapshot?: number;
}) {
  const snap = snapshot != null ? GAME_SNAPSHOTS[snapshot] : null;
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[var(--color-accent-2)]/30 bg-[var(--color-accent-2)]/[0.06]">
      <div className="flex items-center gap-2 border-b border-[var(--color-accent-2)]/20 px-4 py-2">
        <span className="text-sm">✅</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent-2)]">
          Checkpoint — you should now see this
        </span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="text-sm leading-relaxed text-[var(--color-muted)] [&>p]:m-0">
          {children}
        </div>
        {snap && (
          <div className="mx-auto w-40 shrink-0">
            <GomokuBoard
              board={snap.board}
              lastMove={snap.last}
              winningLine={snap.winningLine}
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
}
