import { describe, it, expect } from "vitest";
import { newBoard, idx, P1, P2 } from "@/components/game/constants";
import { checkWin, isBoardFull, opponent } from "@/components/game/engine";

/** place stones for a single player and return the board */
function withStones(cells: Array<[number, number]>, player = P1) {
  const b = newBoard();
  for (const [r, c] of cells) b[idx(r, c)] = player;
  return b;
}

describe("checkWin", () => {
  it("detects a horizontal five", () => {
    const b = withStones([
      [7, 3],
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 7],
    ]);
    expect(checkWin(b, 7, 7, P1)).toHaveLength(5);
  });

  it("detects a vertical five", () => {
    const b = withStones([
      [3, 5],
      [4, 5],
      [5, 5],
      [6, 5],
      [7, 5],
    ]);
    expect(checkWin(b, 5, 5, P1)).not.toBeNull();
  });

  it("detects both diagonal directions", () => {
    const down = withStones([
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
    ]);
    expect(checkWin(down, 4, 4, P1)).not.toBeNull();

    const up = withStones([
      [6, 2],
      [5, 3],
      [4, 4],
      [3, 5],
      [2, 6],
    ]);
    expect(checkWin(up, 4, 4, P1)).not.toBeNull();
  });

  it("does NOT win on only four in a row", () => {
    const b = withStones([
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 7],
    ]);
    expect(checkWin(b, 7, 7, P1)).toBeNull();
  });

  it("wins on an overline of six (freestyle)", () => {
    const b = withStones([
      [7, 2],
      [7, 3],
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 7],
    ]);
    expect(checkWin(b, 7, 7, P1)).not.toBeNull();
  });

  it("ignores stones of the other player in the run", () => {
    const b = newBoard();
    b[idx(7, 3)] = P1;
    b[idx(7, 4)] = P1;
    b[idx(7, 5)] = P2; // gap belongs to opponent
    b[idx(7, 6)] = P1;
    b[idx(7, 7)] = P1;
    expect(checkWin(b, 7, 7, P1)).toBeNull();
  });
});

describe("helpers", () => {
  it("opponent flips player", () => {
    expect(opponent(P1)).toBe(P2);
    expect(opponent(P2)).toBe(P1);
  });

  it("isBoardFull is false for a fresh board", () => {
    expect(isBoardFull(newBoard())).toBe(false);
  });
});
