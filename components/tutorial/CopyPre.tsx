"use client";

import { useRef, useState } from "react";

/** Wraps rehype-pretty-code's <pre> with a hover copy button. */
export function CopyPre(props: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group relative">
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)]/80 px-2 py-1 font-mono text-[11px] text-[var(--color-muted)] opacity-0 backdrop-blur transition hover:text-[var(--color-ink)] group-hover:opacity-100"
      >
        {copied ? "✓ copied" : "copy"}
      </button>
      <pre ref={ref} {...props} />
    </div>
  );
}
