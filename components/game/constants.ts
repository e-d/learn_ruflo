/** Core Gomoku constants & types — shared by the board, the hook, and the AI. */

export const SIZE = 15; // standard competitive board

export type Cell = 0 | 1 | 2; // 0 empty · 1 player one (light) · 2 player two (dark)
export const EMPTY: Cell = 0;
export const P1: Cell = 1; // light pearl stone — moves first
export const P2: Cell = 2; // dark obsidian stone

/** Flat-array index from row/col. */
export const idx = (r: number, c: number) => r * SIZE + c;
export const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < SIZE && c < SIZE;

/** The four axes to scan for a win: vertical, horizontal, and both diagonals. */
export const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

/** Star points (hoshi) for visual reference, 15x15 layout. */
export const STAR_POINTS: ReadonlyArray<readonly [number, number]> = [
  [3, 3],
  [3, 11],
  [7, 7],
  [11, 3],
  [11, 11],
];

export const newBoard = (): Cell[] => new Array(SIZE * SIZE).fill(EMPTY);
