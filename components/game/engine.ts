import { SIZE, EMPTY, DIRS, idx, inBounds, type Cell } from "./constants";

export type Coord = readonly [number, number];

/**
 * Did the stone just played at (r,c) by `player` complete five-in-a-row?
 * Returns the winning run of coordinates (length >= 5) or null.
 *
 * O(1): only scans the 4 axes through the last move, never the whole board.
 * Freestyle rules — an overline (6+) also wins.
 */
export function checkWin(
  board: Cell[],
  r: number,
  c: number,
  player: Cell,
): Coord[] | null {
  for (const [dr, dc] of DIRS) {
    const line: Coord[] = [[r, c]];
    // walk forward
    for (let s = 1; s < SIZE; s++) {
      const nr = r + dr * s,
        nc = c + dc * s;
      if (!inBounds(nr, nc) || board[idx(nr, nc)] !== player) break;
      line.push([nr, nc]);
    }
    // walk backward
    for (let s = 1; s < SIZE; s++) {
      const nr = r - dr * s,
        nc = c - dc * s;
      if (!inBounds(nr, nc) || board[idx(nr, nc)] !== player) break;
      line.unshift([nr, nc]);
    }
    if (line.length >= 5) return line;
  }
  return null;
}

export const isBoardFull = (board: Cell[]) => board.every((c) => c !== EMPTY);

export const cloneBoard = (board: Cell[]) => board.slice();

export const opponent = (p: Cell): Cell => (p === 1 ? 2 : 1);
