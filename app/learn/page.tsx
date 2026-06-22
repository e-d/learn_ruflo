import Link from "next/link";
import { LESSONS } from "@/content/lessons.config";

export default function LearnIndex() {
  const first = LESSONS[0];
  return (
    <div className="max-w-2xl">
      <span className="font-mono text-xs text-[var(--color-accent-2)]">the course</span>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
        Learn ruflo by building Gomoku
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]">
        Nine lessons, four chapters. Each one teaches a single ruflo capability by
        using it to build the next piece of a real five-in-a-row game. By the end
        you&apos;ll have a polished, animated game with a five-level AI — and a
        working command of the harness.
      </p>

      <Link
        href={`/learn/${first.slug}`}
        className="mt-8 inline-block rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-6 py-3 font-medium text-black transition-transform hover:scale-[1.03]"
      >
        Begin Lesson 00 — {first.title} →
      </Link>

      <div className="mt-12 space-y-3">
        {LESSONS.map((l) => (
          <Link
            key={l.slug}
            href={`/learn/${l.slug}`}
            className="flex items-baseline gap-4 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-[var(--color-line)] hover:bg-white/5"
          >
            <span className="font-mono text-sm text-[var(--color-faint)]">
              {l.number.toString().padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="font-medium">{l.title}</div>
              <div className="truncate font-mono text-[11px] text-[var(--color-accent)]">
                ▹ {l.ruflo}
              </div>
            </div>
            <span className="ml-auto shrink-0 font-mono text-xs text-[var(--color-faint)]">
              {l.minutes}m
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
