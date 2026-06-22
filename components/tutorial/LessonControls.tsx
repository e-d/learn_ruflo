"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/content/lessons.config";

export function LessonControls({
  current,
  prev,
  next,
}: {
  current: Lesson;
  prev: Lesson | null;
  next: Lesson | null;
}) {
  const { isDone, toggle, markVisited, hydrated } = useProgress();
  const done = hydrated && isDone(current.slug);

  useEffect(() => {
    markVisited(current.slug);
  }, [current.slug, markVisited]);

  return (
    <div className="mt-12 border-t border-[var(--color-line)] pt-6">
      <button
        onClick={() => toggle(current.slug)}
        className={cn(
          "mb-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-medium transition-colors",
          done
            ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] text-black"
            : "border border-[var(--color-line)] bg-white/5 text-[var(--color-ink)] hover:bg-white/10",
        )}
      >
        {done ? "✓ Lesson complete" : "Mark lesson complete"}
      </button>

      <div className="flex items-stretch justify-between gap-3">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="group flex flex-1 flex-col rounded-xl border border-[var(--color-line)] p-4 transition-colors hover:bg-white/5"
          >
            <span className="font-mono text-[11px] text-[var(--color-faint)]">← Previous</span>
            <span className="mt-1 font-medium text-[var(--color-muted)] group-hover:text-[var(--color-ink)]">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="group flex flex-1 flex-col rounded-xl border border-[var(--color-line)] p-4 text-right transition-colors hover:bg-white/5"
          >
            <span className="font-mono text-[11px] text-[var(--color-accent-2)]">Next →</span>
            <span className="mt-1 font-medium text-[var(--color-muted)] group-hover:text-[var(--color-ink)]">
              {next.title}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>
    </div>
  );
}
