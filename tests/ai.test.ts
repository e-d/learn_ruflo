import { describe, it, expect } from "vitest";
import { newBoard, idx, P1, P2, EMPTY } from "@/components/game/constants";
import { checkWin } from "@/components/game/engine";
import { chooseMove, type AILevel } from "@/components/game/ai/engine";

const set = (b: ReturnType<typeof newBoard>, cells: Array<[number, number]>, p: number) => {
  for (const [r, c] of cells) b[idx(r, c)] = p as 1 | 2;
  return b;
};

const THINKING_LEVELS: AILevel[] = [2, 3, 4, 5];
const ALL_LEVELS: AILevel[] = [1, 2, 3, 4, 5];

describe("chooseMove — legality", () => {
  it("returns an empty, in-bounds cell at every level", () => {
    const b = set(newBoard(), [[7, 7]], P1);
    set(b, [[7, 8]], P2);
    for (const lvl of ALL_LEVELS) {
      const [r, c] = chooseMove(b, P1, lvl);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(15);
      expect(b[idx(r, c)]).toBe(EMPTY);
    }
  });

  it("plays center on an empty board", () => {
    const b = newBoard();
    expect(chooseMove(b, P1, 3)).toEqual([7, 7]);
  });
});

describe("chooseMove — takes an immediate win", () => {
  // P1 has an open four on row 7; one move completes five.
  const winnable = () => set(newBoard(), [[7, 3], [7, 4], [7, 5], [7, 6]], P1);

  for (const lvl of THINKING_LEVELS) {
    it(`level ${lvl} completes the five`, () => {
      const b = winnable();
      const [r, c] = chooseMove(b, P1, lvl);
      b[idx(r, c)] = P1;
      expect(checkWin(b, r, c, P1)).not.toBeNull();
    });
  }
});

describe("chooseMove — blocks an immediate loss", () => {
  // P2 (opponent) has an open four; P1 to move and must block a winning point.
  const mustBlock = () => {
    const b = set(newBoard(), [[7, 3], [7, 4], [7, 5], [7, 6]], P2);
    set(b, [[9, 9], [10, 10]], P1); // P1 has no threat of its own
    return b;
  };

  for (const lvl of THINKING_LEVELS) {
    it(`level ${lvl} blocks at a winning point`, () => {
      const b = mustBlock();
      const move = chooseMove(b, P1, lvl);
      expect([JSON.stringify([7, 2]), JSON.stringify([7, 7])]).toContain(JSON.stringify(move));
    });
  }
});

describe("chooseMove — performance", () => {
  it("level 5 returns within budget on a mid-game board", () => {
    const b = set(newBoard(), [[7, 7], [8, 8], [6, 6], [7, 8], [8, 7]], P1);
    set(b, [[7, 6], [8, 6], [6, 8], [9, 9]], P2);
    const t0 = Date.now();
    const move = chooseMove(b, P1, 5);
    expect(Date.now() - t0).toBeLessThan(2000);
    expect(b[idx(move[0], move[1])]).toBe(EMPTY);
  });
});
