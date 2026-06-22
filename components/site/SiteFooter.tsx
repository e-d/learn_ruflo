import Link from "next/link";

const LINKS = [
  { href: "https://www.linkedin.com/in/edwardstlouis/", label: "LinkedIn" },
  { href: "https://github.com/e-d/learn_ruflo", label: "GitHub" },
  { href: "https://github.com/ruvnet/ruflo", label: "ruflo" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5 text-[var(--color-muted)]">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-xs font-bold text-black">
            ◍
          </span>
          <span>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/edwardstlouis/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-accent-2)]/40 underline-offset-2 transition-colors hover:decoration-[var(--color-accent-2)]"
            >
              Ed St. Louis
            </a>
            <span className="hidden text-[var(--color-faint)] sm:inline">
              {" "}
              · built with ruflo + Claude
            </span>
          </span>
        </div>

        <nav className="flex items-center gap-5 text-[var(--color-muted)]">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--color-ink)]"
            >
              {l.label} ↗
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
