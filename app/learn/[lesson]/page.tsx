import { notFound } from "next/navigation";
import { LESSONS, getLesson, lessonIndex } from "@/content/lessons.config";
import { GameSoFarPanel } from "@/components/tutorial/GameSoFarPanel";
import { LessonControls } from "@/components/tutorial/LessonControls";
import { LESSON_CONTENT } from "@/content/lessons/registry";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ lesson: l.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const i = lessonIndex(slug);
  const prev = i > 0 ? LESSONS[i - 1] : null;
  const next = i < LESSONS.length - 1 ? LESSONS[i + 1] : null;
  const Content = LESSON_CONTENT[slug];

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
      <article className="min-w-0">
        <header>
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-faint)]">
            <span>Lesson {lesson.number.toString().padStart(2, "0")}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-faint)]" />
            <span>{lesson.chapter}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-faint)]" />
            <span>{lesson.minutes} min</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
            {lesson.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted)]">
            {lesson.summary}
          </p>
        </header>

        {Content ? (
          <div className="mt-6">
            <Content />
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-line)] bg-white/[0.02] p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-faint)]">
              in this lesson
            </p>
            <ul className="mt-3 space-y-2 text-[var(--color-muted)]">
              <li className="flex gap-2">
                <span className="text-[var(--color-accent)]">▹</span>
                <span>
                  <strong className="text-[var(--color-ink)]">ruflo:</strong> {lesson.ruflo}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--color-accent-2)]">✦</span>
                <span>
                  <strong className="text-[var(--color-ink)]">you build:</strong> {lesson.builds}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm italic text-[var(--color-faint)]">
              This lesson&apos;s full walkthrough is being written.
            </p>
          </div>
        )}

        <LessonControls current={lesson} prev={prev} next={next} />
      </article>

      <aside className="xl:block">
        <GameSoFarPanel lesson={lesson} />
      </aside>
    </div>
  );
}
