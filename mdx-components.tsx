import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { CopyPre } from "@/components/tutorial/CopyPre";
import { Checkpoint } from "@/components/tutorial/Checkpoint";
import { Callout } from "@/components/tutorial/Callout";
import { Terminal } from "@/components/tutorial/Terminal";
import { LessonBoard } from "@/components/tutorial/LessonBoard";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (p) => (
      <h2
        className="mt-12 scroll-mt-20 font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]"
        {...p}
      />
    ),
    h3: (p) => (
      <h3 className="mt-8 font-display text-lg font-semibold text-[var(--color-ink)]" {...p} />
    ),
    p: (p) => <p className="mt-4 leading-relaxed text-[var(--color-muted)]" {...p} />,
    ul: (p) => <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-muted)]" {...p} />,
    ol: (p) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-[var(--color-muted)]" {...p} />,
    li: (p) => <li className="leading-relaxed [&>strong]:text-[var(--color-ink)]" {...p} />,
    a: ({ href = "", ...p }) => {
      const ext = href.startsWith("http");
      return (
        <Link
          href={href}
          className="text-[var(--color-accent-2)] underline decoration-[var(--color-accent-2)]/30 underline-offset-2 hover:decoration-[var(--color-accent-2)]"
          {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...p}
        />
      );
    },
    strong: (p) => <strong className="font-semibold text-[var(--color-ink)]" {...p} />,
    blockquote: (p) => (
      <blockquote
        className="mt-5 border-l-2 border-[var(--color-accent)]/40 pl-4 italic text-[var(--color-muted)]"
        {...p}
      />
    ),
    hr: () => <hr className="my-10 border-[var(--color-line)]" />,
    // inline code (block code is handled by <pre> → CopyPre)
    code: (p) => {
      const isBlock = typeof p.children !== "string";
      if (isBlock) return <code {...p} />;
      return (
        <code
          className="rounded-md border border-[var(--color-line)] bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--color-ink)]"
          {...p}
        />
      );
    },
    pre: (p) => <CopyPre {...p} />,
    table: (p) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...p} />
      </div>
    ),
    th: (p) => (
      <th
        className="border-b border-[var(--color-line)] px-3 py-2 text-left font-medium text-[var(--color-ink)]"
        {...p}
      />
    ),
    td: (p) => <td className="border-b border-[var(--color-line)]/60 px-3 py-2 text-[var(--color-muted)]" {...p} />,
    // custom lesson components — usable in any .mdx without importing
    Checkpoint,
    Callout,
    Terminal,
    LessonBoard,
    ...components,
  };
}
