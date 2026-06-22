const STYLES = {
  note: { ring: "border-[var(--color-line)]", bg: "bg-white/[0.03]", icon: "💡", label: "Note" },
  ruflo: {
    ring: "border-[var(--color-accent)]/30",
    bg: "bg-[var(--color-accent)]/[0.06]",
    icon: "◍",
    label: "ruflo for real",
  },
  warn: {
    ring: "border-[var(--color-warm)]/30",
    bg: "bg-[var(--color-warm)]/[0.06]",
    icon: "⚠",
    label: "Watch out",
  },
} as const;

/**
 * A side-note box. `type="ruflo"` marks "here's what we actually did with ruflo"
 * asides; `type="warn"` flags pitfalls (including when NOT to use the harness).
 */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof STYLES;
  title?: string;
  children: React.ReactNode;
}) {
  const s = STYLES[type];
  return (
    <div className={`my-6 rounded-2xl border ${s.ring} ${s.bg} p-4`}>
      <div className="mb-1 flex items-center gap-2">
        <span>{s.icon}</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
          {title ?? s.label}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-[var(--color-muted)] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
