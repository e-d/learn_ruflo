"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LESSONS, CHAPTERS, TOTAL_MINUTES } from "@/content/lessons.config";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function LessonSidebar() {
  const pathname = usePathname();
  const { isDone, count, hydrated } = useProgress();
  const pct = Math.round((count / LESSONS.length) * 100);

  return (
    <nav aria-label="Lessons" className="flex flex-col gap-6">
      {/* progress ring + bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your progress</span>
          <span className="font-mono text-xs text-[var(--color-muted)]">
            {hydrated ? `${count}/${LESSONS.length}` : "—"}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] transition-[width] duration-500"
            style={{ width: `${hydrated ? pct : 0}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] text-[var(--color-faint)]">
          ~{Math.round(TOTAL_MINUTES / 60 * 10) / 10}h total
        </p>
      </div>

      {CHAPTERS.map((chapter) => (
        <div key={chapter}>
          <h3 className="mb-2 px-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-faint)]">
            {chapter}
          </h3>
          <ul className="space-y-0.5">
            {LESSONS.filter((l) => l.chapter === chapter).map((l) => {
              const href = `/learn/${l.slug}`;
              const active = pathname === href;
              const done = hydrated && isDone(l.slug);
              return (
                <li key={l.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/10 text-[var(--color-ink)]"
                        : "text-[var(--color-muted)] hover:bg-white/5 hover:text-[var(--color-ink)]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-mono",
                        done
                          ? "border-transparent bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-black"
                          : active
                            ? "border-[var(--color-accent-2)] text-[var(--color-accent-2)]"
                            : "border-[var(--color-line)] text-[var(--color-faint)]",
                      )}
                    >
                      {done ? "✓" : l.number}
                    </span>
                    <span className="leading-tight">{l.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
