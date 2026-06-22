# Learn ruflo — build a Gomoku AI

An interactive tutorial site that teaches [ruflo](https://github.com/ruvnet/ruflo)
(an agent meta-harness for Claude) by incrementally building a polished Gomoku
(five-in-a-row) game with a five-level AI opponent. Nine lessons, each pairing one
ruflo capability with one piece of the game.

Built with **Next.js (App Router)**, **Tailwind CSS v4**, **Motion**, and **MDX**
(Shiki-highlighted code via `rehype-pretty-code`).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Verify

```bash
npm run build    # production build (also type-checks)
npm run lint     # eslint
npm test         # vitest — engine + AI unit/integration tests
```

## What's inside

| Path | What |
| --- | --- |
| `app/` | Routes: `/` landing, `/learn/[lesson]` tutorial, `/play` the full game |
| `content/lessons/*.mdx` | The nine lesson walkthroughs |
| `content/lessons.config.ts` | Lesson catalog (single source of truth) |
| `components/game/` | `GomokuBoard`, `useGomoku`, the engine, and the AI ladder |
| `components/game/ai/` | `evaluate.ts` (shared scorer), `engine.ts` (L1–L5), `worker.ts` (Web Worker) |
| `components/tutorial/` | `Checkpoint`, `Callout`, `Terminal`, code-copy, sidebar, progress |
| `tests/` | `engine`, `ai`, and full-playthrough tests |

## Deploy to Vercel

The app is Vercel-ready (Next.js is auto-detected). Push to GitHub and import the
repo in the Vercel dashboard, or:

```bash
vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed origin so Open Graph metadata resolves
to absolute URLs.

> This project lives alongside a ruflo install (`.claude/`, `.claude-flow/`,
> `.mcp.json`). `CLAUDE.md` holds the ruflo harness guidance; it imports Next.js's
> `AGENTS.md` rules at the bottom.
