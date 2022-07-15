import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { minMaxWrapper } from "./minMax";
import { shuffleArray } from "./utils";

export async function iterativeDeepening(state: State, availableMs: number, workers: Worker[]): Promise<Notation> {
  /*
   * Performs iterative deepening to guess which depth is feasible
   */
  let timeUsed = 0;
  let depth = 0;
  let tempMove = "INITIALIZED";
  while (timeUsed < availableMs) {
    depth++
    console.log(`Iterative deepening reached ${depth}`);
    let start = performance.now();
    tempMove = await minMaxWrapper(state, depth, workers);
    let end = performance.now();
    timeUsed += end - start;
  }
  console.log(`Iterative deepening ended at depth ${depth} after ${timeUsed}`);
  return tempMove;
}
