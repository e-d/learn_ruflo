/// <reference lib="webworker" />
import { chooseMove, type AILevel } from "./engine";
import type { Cell } from "../constants";

type Req = { board: Cell[]; player: Cell; level: AILevel; reqId: number };

// Runs the (synchronous, CPU-heavy) search off the main thread so the board
// stays interactive and the "thinking" animation keeps ticking.
self.onmessage = (e: MessageEvent<Req>) => {
  const { board, player, level, reqId } = e.data;
  const move = chooseMove(board, player, level);
  (self as unknown as Worker).postMessage({ move, reqId });
};
