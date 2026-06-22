import { SIZE, EMPTY, DIRS, idx, inBounds, type Cell } from "../constants";
import { checkWin, opponent, type Coord } from "../engine";

/**
 * Pattern-based board evaluation, shared by every AI level from L2 up.
 * The whole difficulty ladder reuses this one scorer — only the search wrapped
 * around it gets smarter.
 */

// Pattern weights: (run length, number of open ends) -> score.
export const FIVE = 10_000_000;
function patternScore(len: number, openEnds: number): number {
  if (len >= 5) return FIVE;
  if (openEnds === 0) return 0; // blocked both sides — dead
  switch (len) {
    case 4:
      return openEnds === 2 ? 100_000 : 10_000; // open four vs four
    case 3:
      return openEnds === 2 ? 1_000 : 100; // open three vs closed three
    case 2:
      return openEnds === 2 ? 100 : 10;
    default:
      return openEnds === 2 ? 10 : 1;
  }
}

/** Score every contiguous run of `player` on the board (each run counted once). */
function scoreFor(board: Cell[], player: Cell): number {
  let total = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[idx(r, c)] !== player) continue;
      for (const [dr, dc] of DIRS) {
        // only score from the start of a run
        const pr = r - dr,
          pc = c - dc;
        if (inBounds(pr, pc) && board[idx(pr, pc)] === player) continue;
        let len = 1;
        let nr = r + dr,
          nc = c + dc;
        while (inBounds(nr, nc) && board[idx(nr, nc)] === player) {
          len++;
          nr += dr;
          nc += dc;
        }
        const openStart = inBounds(pr, pc) && board[idx(pr, pc)] === EMPTY;
        const openEnd = inBounds(nr, nc) && board[idx(nr, nc)] === EMPTY;
        total += patternScore(len, (openStart ? 1 : 0) + (openEnd ? 1 : 0));
      }
    }
  }
  return total;
}

/** Board value from `me`'s perspective (defense weighted slightly higher). */
export function evaluateBoard(board: Cell[], me: Cell): number {
  return scoreFor(board, me) - 1.2 * scoreFor(board, opponent(me));
}

/** Score only the four lines through (r,c) for `player` — fast, for ordering & L2. */
function lineScoreThrough(board: Cell[], r: number, c: number, player: Cell): number {
  let total = 0;
  for (const [dr, dc] of DIRS) {
    let len = 1;
    let f = 1;
    while (inBounds(r + dr * f, c + dc * f) && board[idx(r + dr * f, c + dc * f)] === player) {
      len++;
      f++;
    }
    let b = 1;
    while (inBounds(r - dr * b, c - dc * b) && board[idx(r - dr * b, c - dc * b)] === player) {
      len++;
      b++;
    }
    const openEnd = inBounds(r + dr * f, c + dc * f) && board[idx(r + dr * f, c + dc * f)] === EMPTY;
    const openStart =
      inBounds(r - dr * b, c - dc * b) && board[idx(r - dr * b, c - dc * b)] === EMPTY;
    total += patternScore(len, (openStart ? 1 : 0) + (openEnd ? 1 : 0));
  }
  return total;
}

/**
 * How good is playing (r,c) for `player`? Offense (my lines) + defense (the
 * opponent threat I deny by taking this cell). Used by the L2 greedy AI and as
 * the move-ordering key for search.
 */
export function moveHeuristic(board: Cell[], r: number, c: number, player: Cell): number {
  // lineScoreThrough treats (r,c) as the given player's stone implicitly (it
  // never reads the center cell), so we can score both offense and defense
  // without cloning/mutating the board.
  const offense = lineScoreThrough(board, r, c, player);
  const defense = lineScoreThrough(board, r, c, opponent(player));
  return offense + 1.1 * defense;
}

function withStone(board: Cell[], r: number, c: number, player: Cell): Cell[] {
  const b = board.slice();
  b[idx(r, c)] = player;
  return b;
}

/** Empty cells within Chebyshev `radius` of an existing stone (center if none). */
export function candidates(board: Cell[], radius = 1): Coord[] {
  const out: Coord[] = [];
  let any = false;
  for (let i = 0; i < board.length; i++) if (board[i] !== EMPTY) any = true;
  if (!any) return [[Math.floor(SIZE / 2), Math.floor(SIZE / 2)]];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[idx(r, c)] !== EMPTY) continue;
      if (hasNeighbor(board, r, c, radius)) out.push([r, c]);
    }
  }
  return out;
}

function hasNeighbor(board: Cell[], r: number, c: number, radius: number): boolean {
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr,
        nc = c + dc;
      if (inBounds(nr, nc) && board[idx(nr, nc)] !== EMPTY) return true;
    }
  }
  return false;
}

/** All empty cells where `player` would immediately win (a "four" yields one). */
export function winningMoves(board: Cell[], player: Cell): Coord[] {
  const out: Coord[] = [];
  for (const [r, c] of candidates(board, 1)) {
    const b = withStone(board, r, c, player);
    if (checkWin(b, r, c, player)) out.push([r, c]);
  }
  return out;
}
