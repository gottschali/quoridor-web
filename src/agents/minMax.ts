import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";
import { evaluateState } from "./evaluateState";
import { shuffleArray } from "./utils";
import { workTypes } from "./Worker";


type minMaxArgs = {
  state: State;
  alpha: number;
  beta: number;
  maxPlayer: Player;
  depth: number;
  maximizing: boolean;
}


export async function minMaxWrapper(state: State, depth: number, workers: Worker[]|null, maxPlayer: Player|null=null): Promise<Notation> {
  maxPlayer = maxPlayer === null ? state.currentPlayer : maxPlayer;
  let start = performance.now();
  let alpha = Number.NEGATIVE_INFINITY;
  let beta = Number.POSITIVE_INFINITY;
  const kids = [...state.children.entries()];
  shuffleArray(kids);
  let t = Number.NEGATIVE_INFINITY;
  let tempMove = "";

  if (workers) {
    const promises = [];
    const n = kids.length;
    const workloads = [];
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
          worker.postMessage([workTypes.MINMAX, move, stateNotation, state.settings, alpha, beta, maxPlayer, depth - 1, false]);
        }
      })
      if (load.length) promises.push(p);
    }
    await Promise.all(promises)
      .then((data) => {
        console.log("All promises resolved, merging results", data);
        for (const part of data) {
          for (const d of part) {
            const move = d[0];
            const value = d[1];
            if (value >= t) {
              t = value;
              tempMove = move;
            }
            alpha = Math.max(alpha, t)
            // Problem: can't break out of the loop because we are in a callback function
            // if (t >= beta) {
            //     break loop;
            // }
          }
        }
      });
    console.log(`Executed alpha-beta-min-max in ${performance.now() - start} ms`)
    return tempMove;
  } else {
    for (const [move, child] of kids) {
      const value = minMax({ state: child, alpha, beta, maxPlayer, depth: depth- 1, maximizing: false });
      if (value >= t) {
        t = value;
        tempMove = move;
      }
      alpha = Math.max(alpha, t)
    }
    return tempMove;
  }
}

export function minMax({ state, alpha, beta, maxPlayer, depth, maximizing }: minMaxArgs): number {
  if (state.isGameOver()) {
    return state.winner() === maxPlayer ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }

  if (depth <= 0) {
    return evaluateState(state, maxPlayer);
  }

  const kids = [...state.children.values()];
  shuffleArray(kids);
  // console.log(`Recursively exploring all ${state.legalMoves.length} moves with depth ${depth}`);
  if (maximizing) {
    let value = Number.NEGATIVE_INFINITY;
    for (const child of kids) {
      value = Math.max(value, minMax({ state: child, alpha, beta, maxPlayer, depth: depth - 1, maximizing: false }));
      alpha = Math.max(alpha, value);
      if (value >= beta) {
        break;
      }
    }
    return value;
  } else {
    let value = Number.POSITIVE_INFINITY;
    for (const child of kids) {
      value = Math.min(value, minMax({ state: child, alpha, beta, maxPlayer, depth: depth - 1, maximizing: true }));
      beta = Math.min(beta, value);
      if (value <= alpha) {
        break;
      }
    }
    return value;
  }
}

