import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";
import { evaluateState } from "./evaluateState";
import { shuffleArray } from "./utils";

}

export function minMax({ state, alpha, beta, maxPlayer, depth, maximizing}: { state: State; alpha: number; beta: number; maxPlayer: Player; depth: number; maximizing: boolean; }): number {
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
