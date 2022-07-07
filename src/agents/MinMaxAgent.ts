import { Move } from "../quoridor/Move";
import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";


export function evaluateState(state: State, evalPlayer: Player) {
    // (already computed) Perform BFS for both pawns to get distance to finishline
    const d1 = state.shortestPaths[evalPlayer];
    const otherPlayer = evalPlayer === Player.white ? Player.black : Player.white;
    const d2 = state.shortestPaths[otherPlayer];
    if (state.wallsAvailable[0] + state.wallsAvailable[1] === 0) {
        // The one with shorter distance wins
        // But check if a jump could influence it!
        // TODO: do it correctly with taking account for jumps
        // jumps should not be a problem if difference bigger than 1
        // or the distance to the enemy pawn is farther than to the end
        // Wait: we can just play it out
    }
    // factor in the walls available
    return d2 - d1 + 0 * state.wallsAvailable[evalPlayer] - 0 * state.wallsAvailable[otherPlayer] + Math.random();
    // return (30-d1) + d2 + 10 +  Math.random() * 5;
}

let nodes = 0;

export type Heuristic = null | ((state: State)=>Move[]);

function minMax(state: State, alpha: number, beta: number, maxPlayer: Player, depth: number, heuristic: Heuristic, maximizing: boolean): number {
    nodes++;
    if (state.isGameOver()) {
        return state.winner() === maxPlayer ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (depth <= 0) {
        // return board evaluation
        return evaluateState(state, maxPlayer);
    }

    // const cands = heuristic === null ? state.legalMoves : heuristic(state);
    // console.log(`Heuristic: ${cands.length}`);
    // console.log(`Recursively exploring all ${state.legalMoves.length} moves with depth ${depth}`);
    if (maximizing) {
        let value = Number.NEGATIVE_INFINITY;
        for (const child of state.children.values()) {
            value = Math.max(value, minMax(child, alpha, beta, maxPlayer, depth - 1, heuristic, false));
            alpha = Math.max(alpha, value);
            if (value >= beta) {
                break;
            }
        }
        return value;
    } else {
        let value = Number.POSITIVE_INFINITY;
        for (const child of state.children.values()) {
            value = Math.min(value, minMax(child, alpha, beta, maxPlayer, depth - 1, heuristic, true));
            beta = Math.min(beta, value);
            if (value <= alpha) {
                break;
            }
        }
        return value;
    }
}
function shuffleArray(arr: Array<any>) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function MinMaxAgent(depth=5, heuristic: Heuristic=null) {
    function minMaxWrapper(state: State): Notation {
        nodes = 0;
        console.log(`Exploring all ${state.children.size} children with a depth of ${depth}`)
        console.log(state, state.children);
        // const cands = heuristic === null ? state.legalMoves : heuristic(state);
        // console.log(`Heuristic: ${cands.length}`);
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        const kids = [...state.children.entries()];
        shuffleArray(kids);
        let t = Number.NEGATIVE_INFINITY;
        let tempMove = "";
        for (const [move, child] of kids) {
            const value = minMax(child, alpha, beta, state.currentPlayer, depth-1, heuristic, false);
            if (value >= t) {
                t = value;
                tempMove = move;
            }
            alpha = Math.max(alpha, t)
            if (t >= beta) {
                break;
            }
        }
        console.log(`Searched spanned ${nodes}`);
        return tempMove;
    }
    return {
        isMachine: true,
        name: 'MinMaxAgent',
        getMove: minMaxWrapper,
    }
}
