import { describe, it, expect } from "vitest";
import { SIZE, newBoard, idx, P1, EMPTY, type Cell } from "@/components/game/constants";
import { checkWin, isBoardFull, opponent } from "@/components/game/engine";
import { chooseMove, type AILevel } from "@/components/game/ai/engine";

/** Play an AI-vs-AI game (optionally capped); assert every move is legal. */
function playGame(levelA: AILevel, levelB: AILevel, maxPlies = SIZE * SIZE) {
  const board = newBoard();
  let toMove: Cell = P1;
  const cap = Math.min(maxPlies, SIZE * SIZE);
  for (let ply = 0; ply < cap; ply++) {
    const level = toMove === P1 ? levelA : levelB;
    const [r, c] = chooseMove(board, toMove, level);
    expect(board[idx(r, c)]).toBe(EMPTY); // never plays an occupied cell
    board[idx(r, c)] = toMove;
    if (checkWin(board, r, c, toMove)) return { result: "win" as const, winner: toMove, ply };
    if (isBoardFull(board)) return { result: "draw" as const, ply };
    toMove = opponent(toMove);
  }
  return { result: "capped" as const };
}

describe("full playthroughs", () => {
  it("heuristic vs heuristic terminates legally (win or draw)", () => {
    const g = playGame(2, 2);
    expect(["win", "draw"]).toContain(g.result);
  });

  it("a stronger level beats a much weaker one (L4 vs L1)", () => {
    // L1 is random; over a couple of games L4 should win as P1.
    const wins = [playGame(4, 1), playGame(4, 1)].filter(
      (g) => g.result === "win" && "winner" in g && g.winner === P1,
    );
    expect(wins.length).toBeGreaterThanOrEqual(1);
  });

  it("L5 vs L5 composes legally in self-play", () => {
    // Capped: one L5 move/turn is verified for speed elsewhere; here we just
    // confirm the deepest AI plays legal moves against itself.
    const g = playGame(5, 5, 24);
    expect(["win", "draw", "capped"]).toContain(g.result);
  });
});
