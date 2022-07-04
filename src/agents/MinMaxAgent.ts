import { Move } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";
import { wallsHeuristic } from "./wallsHeuristic";

export function evaluateState(state: State, evalPlayer: Player) {
    // Perform BFS for both pawns to get distance to finishline
    const d1 = state.BFS(state.pawnPositions[evalPlayer], evalPlayer);
    const otherPlayer = evalPlayer === Player.white ? Player.black : Player.white;
    const d2 = state.BFS(state.pawnPositions[otherPlayer], otherPlayer);
    // factor in the walls available
    return (20-d1) + d2 + Math.random();
}

let nodes = 0;

export type Heuristic = (state: State)=>Move[];

function minMax(state: State, maxPlayer: Player, depth: number, heuristic: Heuristic) {
    nodes++;
    if (state.isGameOver()) {
        return state.winner() === maxPlayer ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    if (depth <= 0) {
        // return board evaluation
        return evaluateState(state, maxPlayer);
    }

    const cands = heuristic(state);
    console.log(`Heuristic: ${cands.length}`);
    console.log(`Recursively exploring all ${state.legalMoves.length} moves with depth ${depth}`);
    if (state.currentPlayer === maxPlayer) {
        let t = Number.NEGATIVE_INFINITY;
        for (const child of cands) {
            const value = minMax(state.makeMove(child), maxPlayer, depth - 1, heuristic);
            if (value >= t) {
                t = value;
            }
        }
        return t;
    } else {
        let t = Number.POSITIVE_INFINITY;
        for (const child of cands) {
            const value = minMax(state.makeMove(child), maxPlayer, depth - 1, heuristic);
            if (value <= t) {
                t = value;
            }
        }
        return t;
    }
}


export function MinMaxAgent(depth=5, heuristic: Heuristic=(state)=>state.legalMoves) {
    function minMaxWrapper(state: State): Move {
        nodes = 0;
        let t = Number.NEGATIVE_INFINITY;
        let tempMove = state.legalMoves[0];
        console.log(`Exploring all ${state.legalMoves.length} moves with a depth of ${depth}`)

        const cands = heuristic(state);
        console.log(`Heuristic: ${cands.length}`);
        for (const child of cands) {
            const value = minMax(state.makeMove(child), state.currentPlayer, depth-1, heuristic);
            if (value >= t) {
                t = value;
                tempMove = child;
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
