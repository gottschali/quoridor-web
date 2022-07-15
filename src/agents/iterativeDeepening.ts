import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { shuffleArray } from "./utils";

export async function iterativeDeepening(state: State, availableMs: number, workers: Worker[]): Promise<Notation> {
  /*
   * Performs iterative deepening to guess which depth is feasible
   */
  let timeUsed = 0;
  let depth = 0;
  let tempMove = "";
  while (timeUsed < availableMs) {
    depth++
    console.log(`Iterative deepening reached ${depth}`);
    let start = performance.now();
    let alpha = Number.NEGATIVE_INFINITY;
    let beta = Number.POSITIVE_INFINITY;
    const kids = [...state.children.entries()];
    shuffleArray(kids);
    let t = Number.NEGATIVE_INFINITY;
    const promises = [];
    const n = kids.length;
    const workloads = [];
    // const workers = [new Worker(), new Worker(), new Worker(), new Worker()];
    for (let i = 0; i < workers.length - 1; i++) {
      workloads.push(kids.splice(0, n / workers.length));
    }
    workloads.push(kids);

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const load = workloads[i];
      const data: [Notation, number][] = [];
      const p = new Promise<[Notation, number][]>(function (resolve) {
        // Reusing workers didnt work because onmessage was overwritten and promises were not resolved
        worker.onmessage = function (e: MessageEvent) {
          data.push(e.data);
          if (data.length === load.length) {
            resolve(data);
          }
        }
        for (const [move, child] of load) {
          const stateNotation = child.toNotation();
          worker.postMessage([move, stateNotation, state.settings, alpha, beta, state.currentPlayer, depth - 1, false]);
        }
      })
      if (load.length) promises.push(p);
    }


    await Promise.all(promises)
      .then((data) => {
        for (const part of data) {
          for (const d of part) {
            const move = d[0];
            const value = d[1];
            if (value >= t) {
              t = value;
              tempMove = move;
            }
            alpha = Math.max(alpha, t)
          }
        }
      });
    let end = performance.now();
    timeUsed += end - start;
  }
  console.log(`Iterative deepening ended at depth ${depth} after ${timeUsed}`);
  return tempMove;
}
