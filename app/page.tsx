import Link from "next/link";
import { GomokuBoard } from "@/components/game/GomokuBoard";
import { GAME_SNAPSHOTS } from "@/components/game/snapshots";
import { Reveal } from "@/components/site/Reveal";
import { LESSONS, TOTAL_MINUTES, CHAPTERS } from "@/content/lessons.config";

const finalGame = GAME_SNAPSHOTS[8];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6">
      {/* ---------------- Hero ---------------- */}
      <section className="relative grid items-center gap-10 pt-16 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/5 px-3 py-1 font-mono text-xs text-[var(--color-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)]" />
              interactive course · {LESSONS.length} lessons · ~{Math.round(TOTAL_MINUTES / 60 * 10) / 10}h
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Learn <span className="gradient-text">ruflo</span> by building a Gomoku&nbsp;AI.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
              ruflo is an agent meta-harness for Claude — swarms, memory, hooks, and
              more. You&apos;ll master it the only way that sticks: by using each
              capability to build a real five-in-a-row game with a five-level AI
              opponent.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/learn"
                className="rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-6 py-3 font-medium text-black transition-transform hover:scale-[1.03]"
              >
                Start learning →
              </Link>
              <Link
                href="/play"
                className="rounded-full border border-[var(--color-line)] bg-white/5 px-6 py-3 font-medium text-[var(--color-ink)] transition-colors hover:bg-white/10"
              >
                Play the game
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/20 blur-2xl" />
          <div className="mx-auto w-full max-w-md">
            <GomokuBoard
              board={finalGame.board}
              lastMove={finalGame.last}
              winningLine={finalGame.winningLine}
              compact
            />
            <p className="mt-3 text-center font-mono text-xs text-[var(--color-faint)]">
              the finished game — light wins on row 8
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------- Bento highlights ---------------- */}
      <section className="grid auto-rows-[150px] grid-cols-2 gap-4 lg:grid-cols-4">
        <BentoCard className="col-span-2 row-span-2 lg:col-span-2" accent>
          <h2 className="font-display text-2xl font-semibold">What you&apos;ll build</h2>
          <p className="mt-2 max-w-md text-[var(--color-muted)]">
            A production-grade Gomoku game: animated stone drops, a glowing
            win-line, full keyboard play, and an AI you can dial from clueless to
            near-unbeatable.
          </p>
          <div className="mt-auto flex flex-wrap gap-2 font-mono text-xs">
            {["15×15 board", "Web Worker AI", "VCF/VCT search", "reduced-motion"].map((t) => (
              <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-[var(--color-muted)]">
                {t}
              </span>
            ))}
          </div>
        </BentoCard>

        <BentoCard>
          <Stat value="9" label="lessons, each shipping a real feature" />
        </BentoCard>
        <BentoCard>
          <Stat value="5" label="AI difficulty levels you build by hand" />
        </BentoCard>
        <BentoCard className="col-span-2">
          <h3 className="font-display text-lg font-semibold">Real ruflo, documented</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Every lesson reflects what actually happened when we drove the build
            with ruflo — memory, SPARC, swarms, hooks — including when <em>not</em> to
            use it.
          </p>
        </BentoCard>
        <BentoCard className="col-span-2 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold">Four chapters</h3>
          <ol className="mt-2 space-y-1 text-sm text-[var(--color-muted)]">
            {CHAPTERS.map((ch, i) => (
              <li key={ch} className="flex gap-2">
                <span className="font-mono text-[var(--color-accent-2)]">{i + 1}</span>
                {ch}
              </li>
            ))}
          </ol>
        </BentoCard>
      </section>

      {/* ---------------- Lesson grid ---------------- */}
      <section className="mt-20">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight">The curriculum</h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Each lesson pairs one ruflo capability with one piece of the game.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((l, i) => (
            <Reveal key={l.slug} delay={(i % 3) * 0.05}>
              <Link
                href={`/learn/${l.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]/60 p-5 transition-colors hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--color-faint)]">
                    Lesson {l.number.toString().padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-[var(--color-faint)]">{l.minutes} min</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-[var(--color-accent-2)]">
                  {l.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {l.summary}
                </p>
                <div className="mt-4 flex flex-col gap-1 border-t border-[var(--color-line)] pt-3 font-mono text-[11px]">
                  <span className="text-[var(--color-accent)]">▹ {l.ruflo}</span>
                  <span className="text-[var(--color-faint)]">✦ {l.builds}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

function BentoCard({
  children,
  className = "",
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-[var(--color-line)] p-5 ${
        accent
          ? "bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]"
          : "bg-[var(--color-surface)]/60"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <span className="font-display text-4xl font-bold gradient-text">{value}</span>
      <span className="mt-1 text-sm text-[var(--color-muted)]">{label}</span>
    </div>
  );
}
