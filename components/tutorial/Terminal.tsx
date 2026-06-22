/** A faux terminal frame for showing real CLI commands and their output. */
export function Terminal({ title = "zsh", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[#0d0d12]">
      <div className="flex items-center gap-1.5 border-b border-[var(--color-line)] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-[var(--color-faint)]">{title}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--color-muted)]">
        {children}
      </pre>
    </div>
  );
}
