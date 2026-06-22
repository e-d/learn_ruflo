"use client";

import { useCallback, useMemo, useState } from "react";
import { P1, P2, EMPTY, newBoard, idx, type Cell } from "./constants";
import { checkWin, isBoardFull, opponent, type Coord } from "./engine";

export type Status = "playing" | "won" | "draw";

export type GameState = {
  board: Cell[];
  current: Cell;
  status: Status;
  winner: Cell | null;
  winningLine: Coord[] | null;
  /** move indices in play order (for undo + move count) */
  history: number[];
  lastMove: Coord | null;
};

const initial = (): GameState => ({
  board: newBoard(),
  current: P1,
  status: "playing",
  winner: null,
  winningLine: null,
  history: [],
  lastMove: null,
});

/**
 * Pure local game-state machine for Gomoku. Mode-agnostic: a 2-player UI calls
 * play() on click; an AI wrapper calls the same play() with the engine's move.
 */
export function useGomoku() {
  const [state, setState] = useState<GameState>(initial);

  const play = useCallback((r: number, c: number) => {
    setState((s) => {
      if (s.status !== "playing") return s;
      const i = idx(r, c);
      if (s.board[i] !== EMPTY) return s; // occupied

      const board = s.board.slice();
      board[i] = s.current;

      const line = checkWin(board, r, c, s.current);
      if (line) {
        return {
          ...s,
          board,
          status: "won",
          winner: s.current,
          winningLine: line,
          history: [...s.history, i],
          lastMove: [r, c],
        };
      }
      if (isBoardFull(board)) {
        return { ...s, board, status: "draw", history: [...s.history, i], lastMove: [r, c] };
      }
      return {
        ...s,
        board,
        current: opponent(s.current),
        history: [...s.history, i],
        lastMove: [r, c],
      };
    });
  }, []);

  /** Undo the last `count` moves (used to take back a human + AI pair). */
  const undo = useCallback((count = 1) => {
    setState((s) => {
      if (s.history.length === 0) return s;
      const n = Math.min(count, s.history.length);
      const history = s.history.slice(0, -n);
      const board = newBoard();
      let current: Cell = P1;
      for (const i of history) {
        board[i] = current;
        current = opponent(current);
      }
      const lastIdx = history[history.length - 1];
      const lastMove: Coord | null =
        lastIdx === undefined ? null : [Math.floor(lastIdx / 15), lastIdx % 15];
      return {
        board,
        current,
        status: "playing",
        winner: null,
        winningLine: null,
        history,
        lastMove,
      };
    });
  }, []);

  const reset = useCallback(() => setState(initial()), []);

  const moveCount = state.history.length;
  const counts = useMemo(() => {
    let p1 = 0,
      p2 = 0;
    for (const cell of state.board) {
      if (cell === P1) p1++;
      else if (cell === P2) p2++;
    }
    return { p1, p2 };
  }, [state.board]);

  return { ...state, play, undo, reset, moveCount, counts };
}
