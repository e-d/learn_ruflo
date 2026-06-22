# Learn ruflo — build a Gomoku AI

An interactive tutorial site that teaches [ruflo](https://github.com/ruvnet/ruflo)
(an agent meta-harness for Claude) by incrementally building a polished Gomoku
(five-in-a-row) game with a five-level AI opponent. Nine lessons, each pairing one
ruflo capability with one piece of the game.

Built with **Next.js (App Router)**, **Tailwind CSS v4**, **Motion**, and **MDX**
(Shiki-highlighted code via `rehype-pretty-code`).

[![Live demo](https://img.shields.io/badge/demo-live-22d3ee)](https://learnruflo.vercel.app)
[![License: MIT](https://img.shields.io/badge/license-MIT-7c5cff)](LICENSE)

**▶ Live demo: [learnruflo.vercel.app](https://learnruflo.vercel.app)**

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

> The tutorial was built *with* ruflo (an agent meta-harness for Claude). The
> ruflo runtime files (`.claude/`, `.claude-flow/`, `.swarm/`, `.mcp.json`, the
> local memory DBs) are intentionally **git-ignored** — they're local tooling
> state, not part of the app.

## License

[MIT](LICENSE) © 2026 e-d
