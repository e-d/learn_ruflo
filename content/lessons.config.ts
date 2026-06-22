/**
 * The course catalog — single source of truth for lessons.
 * Used by the landing page, the /learn sidebar, progress tracking, and routing.
 *
 * `boardSnapshot` is the index into GAME_SNAPSHOTS (components/game/snapshots.ts)
 * that the "your game so far" panel shows at the end of each lesson.
 */

export type Lesson = {
  slug: string;
  number: number;
  chapter: string;
  title: string;
  /** ruflo capability taught */
  ruflo: string;
  /** game increment built */
  builds: string;
  minutes: number;
  summary: string;
  /** which cumulative game state to show in the "game so far" panel */
  boardSnapshot: number;
};

export const CHAPTERS = [
  "Getting oriented",
  "Building the game",
  "Teaching the machine",
  "Automating the work",
] as const;

export const LESSONS: Lesson[] = [
  {
    slug: "the-mental-model",
    number: 0,
    chapter: "Getting oriented",
    title: "The mental model & setup",
    ruflo: "init · doctor · Agent vs MCP vs CLI",
    builds: "Project scaffolded, board renders",
    minutes: 8,
    summary:
      "What ruflo actually is, how its three surfaces fit together, and why we scaffolded the app by hand instead of with a swarm.",
    boardSnapshot: 0,
  },
  {
    slug: "skills",
    number: 1,
    chapter: "Getting oriented",
    title: "Skills: the shortcuts",
    ruflo: "Skills — what they are & which matter",
    builds: "Click-to-place stones + turns",
    minutes: 10,
    summary:
      "Invoke a ruflo skill to scaffold the interactive board. Learn the highest-value skills and when a skill beats a from-scratch prompt.",
    boardSnapshot: 1,
  },
  {
    slug: "agents",
    number: 2,
    chapter: "Building the game",
    title: "Agents: delegating work",
    ruflo: "Agent types, routing, the Agent tool",
    builds: "Win detection → 2-player game",
    minutes: 12,
    summary:
      "Spawn a named coder agent to implement and verify five-in-a-row detection. Learn agent types and how ruflo routes a task to the right one.",
    boardSnapshot: 2,
  },
  {
    slug: "memory",
    number: 3,
    chapter: "Building the game",
    title: "Memory & learning",
    ruflo: "store · search · namespaces · vectors",
    builds: "History, undo, last-move highlight",
    minutes: 11,
    summary:
      "Search memory before a task and store what worked after. See the vector recall that lets ruflo remember decisions across sessions.",
    boardSnapshot: 3,
  },
  {
    slug: "sparc",
    number: 4,
    chapter: "Teaching the machine",
    title: "SPARC: design before code",
    ruflo: "Specification → Pseudocode → … → Completion",
    builds: "AI L1 (random) + L2 (heuristic)",
    minutes: 14,
    summary:
      "Run the SPARC methodology to design the board-evaluation function before writing it, then build the first two AI levels on top of it.",
    boardSnapshot: 4,
  },
  {
    slug: "swarms",
    number: 5,
    chapter: "Teaching the machine",
    title: "Swarms: coordinated teams",
    ruflo: "topology · SendMessage · pipeline vs fan-out",
    builds: "AI L3 minimax + L4 alpha-beta + Worker",
    minutes: 16,
    summary:
      "Coordinate an architect → coder → tester → reviewer team to build the search engine, and move it into a Web Worker so the UI never freezes.",
    boardSnapshot: 5,
  },
  {
    slug: "hooks-and-workers",
    number: 6,
    chapter: "Automating the work",
    title: "Hooks & background workers",
    ruflo: "pre/post hooks · audit/optimize/testgaps · daemon",
    builds: "Tests, animations, difficulty selector",
    minutes: 12,
    summary:
      "The automation layer: hooks that fire on your tool calls and background workers that sweep the codebase while you build.",
    boardSnapshot: 6,
  },
  {
    slug: "hive-mind-and-mcp",
    number: 7,
    chapter: "Automating the work",
    title: "Hive-mind, MCP & judgment",
    ruflo: "consensus · ToolSearch · when (not) to use ruflo",
    builds: "AI L5 threat-space search, final polish",
    minutes: 15,
    summary:
      "Reach a hive-mind consensus on the capstone AI, discover MCP tools on demand, and learn — honestly — when the harness helps and when it's overhead.",
    boardSnapshot: 7,
  },
  {
    slug: "github-automation",
    number: 8,
    chapter: "Automating the work",
    title: "GitHub automation",
    ruflo: "PR manager · code-review swarm · releases",
    builds: "Ship it: PR, review, deploy to Vercel",
    minutes: 12,
    summary:
      "Put ruflo's GitHub agents to work: an automated PR, a code-review swarm, and a release — then deploy the finished game.",
    boardSnapshot: 8,
  },
];

export const TOTAL_MINUTES = LESSONS.reduce((s, l) => s + l.minutes, 0);

export const getLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonIndex = (slug: string) => LESSONS.findIndex((l) => l.slug === slug);
