import { GameClient } from "@/components/game/GameClient";

export default function PlayPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="font-mono text-xs text-[var(--color-accent-2)]">/play</span>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">The arena</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          The finished game — everything built across the lessons. Pick an opponent,
          dial the AI from clueless to brutal, and try to get five in a row.
        </p>
      </div>
      <GameClient />
    </main>
  );
}
