"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/play", label: "Play" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-sm font-bold text-black">
            ◍
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            learn<span className="gradient-text">ruflo</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors",
                  active
                    ? "bg-white/10 text-[var(--color-ink)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://github.com/ruvnet/ruflo"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hidden rounded-full border border-[var(--color-line)] px-3 py-1.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] sm:block"
          >
            ruflo ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
