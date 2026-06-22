import { idx, type Cell } from "../constants";
import { checkWin, opponent, type Coord } from "../engine";
import {
  evaluateBoard,
  candidates,
  moveHeuristic,
  winningMoves,
} from "./evaluate";

export type AILevel = 1 | 2 | 3 | 4 | 5;

export const AI_LEVELS: { level: AILevel; name: string; blurb: string }[] = [
  { level: 1, name: "Random", blurb: "Plays anywhere near the action. Clueless." },
  { level: 2, name: "Heuristic", blurb: "Scores each move; blocks & builds. No look-ahead." },
  { level: 3, name: "Minimax", blurb: "Looks 2 plies ahead. Sees simple traps." },
  { level: 4, name: "Alpha-beta", blurb: "Deeper pruned search + move ordering. Strong." },
  { level: 5, name: "Threat search", blurb: "Adds VCF forced-win hunting. Brutal." },
];

const WIN_SCORE = 1e9;

const place = (board: Cell[], r: number, c: number, p: Cell): Cell[] => {
  const b = board.slice();
  b[idx(r, c)] = p;
  return b;
};

/** Candidates ordered by the shared move heuristic (best first), capped. */
function ordered(board: Cell[], toMove: Cell, limit: number): Coord[] {
  return candidates(board, 1)
    .map(([r, c]) => ({ r, c, s: moveHeuristic(board, r, c, toMove) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ r, c }) => [r, c] as Coord);
}

/** Minimax from `me`'s perspective, optionally alpha-beta pruned. */
function search(
  board: Cell[],
  toMove: Cell,
  depth: number,
  alpha: number,
  beta: number,
  prune: boolean,
  me: Cell,
  limit: number,
): number {
  if (depth === 0) return evaluateBoard(board, me);
  const cs = ordered(board, toMove, limit);
  if (cs.length === 0) return evaluateBoard(board, me);

  if (toMove === me) {
    let best = -Infinity;
    for (const [r, c] of cs) {
      const b = place(board, r, c, toMove);
      const val = checkWin(b, r, c, toMove)
        ? WIN_SCORE + depth // prefer faster wins
        : search(b, opponent(toMove), depth - 1, alpha, beta, prune, me, limit);
      if (val > best) best = val;
      if (best > alpha) alpha = best;
      if (prune && alpha >= beta) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const [r, c] of cs) {
      const b = place(board, r, c, toMove);
      const val = checkWin(b, r, c, toMove)
        ? -(WIN_SCORE + depth)
        : search(b, opponent(toMove), depth - 1, alpha, beta, prune, me, limit);
      if (val < best) best = val;
      if (best < beta) beta = best;
      if (prune && alpha >= beta) break;
    }
    return best;
  }
}

/**
 * VCF — Victory by Continuous Fours. Search only forcing moves (each creates a
 * four, so the opponent's reply is forced). Narrow, so it goes deep cheaply.
 * Returns the first attacking move of a forced win, or null.
 */
function vcf(board: Cell[], me: Cell, depth: number): Coord | null {
  if (depth <= 0) return null;
  for (const [r, c] of ordered(board, me, 16)) {
    const b = place(board, r, c, me);
    if (checkWin(b, r, c, me)) return [r, c]; // made five
    const myWins = winningMoves(b, me);
    if (myWins.length === 0) continue; // not a forcing four
    if (myWins.length >= 2) return [r, c]; // open/double four — unstoppable

    // single four: opponent is forced to block the one winning point
    const [br, bc] = myWins[0];
    const b2 = place(b, br, bc, opponent(me));
    // if the block lets the opponent win immediately, this line is refuted
    if (winningMoves(b2, opponent(me)).length > 0) continue;
    if (vcf(b2, me, depth - 1)) return [r, c];
  }
  return null;
}

/** Pick the AI's move for the given difficulty level. */
export function chooseMove(board: Cell[], me: Cell, level: AILevel): Coord {
  const cs = candidates(board, level === 1 ? 2 : 1);
  if (cs.length === 0) return [7, 7];

  // L1 — random near the action
  if (level === 1) return cs[Math.floor(Math.random() * cs.length)];

  // Every level above 1: take an immediate win, then block an immediate loss.
  for (const [r, c] of cs) {
    if (checkWin(place(board, r, c, me), r, c, me)) return [r, c];
  }
  const oppWins = winningMoves(board, opponent(me));
  if (oppWins.length > 0) {
    // block the most valuable of the opponent's winning points
    return [...oppWins].sort(
      (a, b) => moveHeuristic(board, b[0], b[1], me) - moveHeuristic(board, a[0], a[1], me),
    )[0];
  }

  // L2 — greedy single-move heuristic (no look-ahead)
  if (level === 2) {
    return [...cs].sort(
      (a, b) => moveHeuristic(board, b[0], b[1], me) - moveHeuristic(board, a[0], a[1], me),
    )[0];
  }

  // L5 — hunt for a forced win via continuous fours before searching
  if (level === 5) {
    const forced = vcf(board, me, 10);
    if (forced) return forced;
  }

  // L3 plain minimax (depth 2, no pruning); L4/L5 alpha-beta (depth 4, ordered)
  const prune = level >= 4;
  const depth = level === 3 ? 2 : 4;
  const limit = level === 3 ? 12 : 10;

  let best = ordered(board, me, 16)[0];
  let bestVal = -Infinity;
  for (const [r, c] of ordered(board, me, 16)) {
    const b = place(board, r, c, me);
    const val = checkWin(b, r, c, me)
      ? WIN_SCORE
      : search(b, opponent(me), depth - 1, -Infinity, Infinity, prune, me, limit);
    if (val > bestVal) {
      bestVal = val;
      best = [r, c];
    }
  }
  return best;
}
