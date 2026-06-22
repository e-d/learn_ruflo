import { newBoard, idx, P1, P2, type Cell } from "./constants";

/**
 * One illustrative game, replayed move-by-move. Each lesson's "game so far"
 * panel shows the board after a growing number of these moves, so the game
 * visibly fills in as the learner progresses. The final move completes a
 * horizontal five-in-a-row for the light player.
 */
const MOVES: ReadonlyArray<readonly [number, number, Cell]> = [
  [7, 7, P1],
  [7, 8, P2],
  [8, 8, P1],
  [6, 6, P2],
  [8, 7, P1],
  [9, 9, P2],
  [8, 9, P1],
  [6, 8, P2],
  [8, 6, P1],
  [8, 10, P2],
  [10, 7, P1],
  [5, 8, P2],
  [8, 5, P1], // → row 8, cols 5..9: five in a row, light wins
];

export type Snapshot = {
  board: Cell[];
  last?: readonly [number, number];
  winningLine?: ReadonlyArray<readonly [number, number]>;
  winner?: Cell;
};

function boardAfter(n: number): Snapshot {
  const board = newBoard();
  for (let i = 0; i < n; i++) {
    const [r, c, p] = MOVES[i];
    board[idx(r, c)] = p;
  }
  const last = n > 0 ? ([MOVES[n - 1][0], MOVES[n - 1][1]] as const) : undefined;
  return { board, last };
}

/** Cumulative game state per lesson (index === lesson.boardSnapshot). */
export const GAME_SNAPSHOTS: Snapshot[] = [
  boardAfter(0), // 0 — empty board renders
  boardAfter(2), // 1 — first stones placed
  boardAfter(4), // 2 — win detection / 2-player
  boardAfter(6), // 3 — history & undo
  boardAfter(8), // 4 — AI L1/L2
  boardAfter(10), // 5 — AI L3/L4
  boardAfter(11), // 6 — hooks & polish
  boardAfter(12), // 7 — capstone AI, one move from a win
  {
    ...boardAfter(13), // 8 — the winning position
    winningLine: [
      [8, 5],
      [8, 6],
      [8, 7],
      [8, 8],
      [8, 9],
    ],
    winner: P1,
  },
];
