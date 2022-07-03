import { Move } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";

function evaluateState(state: State, evalPlayer: Player) {
    // Perform BFS for both pawns to get distance to finishline
    const d1 = state.BFS(state.pawnPositions[evalPlayer], evalPlayer);
    const otherPlayer = evalPlayer === Player.white ? Player.black : Player.white;
    const d2 = state.BFS(state.pawnPositions[otherPlayer], otherPlayer);
    // factor in the walls available
    return (10-d1) + d2;
}

let nodes = 0;

function minMax(state: State, maxPlayer: Player, depth: number) {
    nodes++;
    if (state.isGameOver()) {
        return state.winner() === maxPlayer ? 42 : -42;
    }
    if (depth <= 0) {
        // return board evaluation
        return evaluateState(state, maxPlayer);
    }

    console.log(`Recursively exploring all ${state.legalMoves.length} moves with depth ${depth}`);
    if (state.currentPlayer === maxPlayer) {
        let t = Number.NEGATIVE_INFINITY;
        for (const child of state.legalMoves) {
            const value = minMax(state.makeMove(child), maxPlayer, depth - 1);
            if (value >= t) {
                t = value;
            }
        }
        return t;
    } else {
        let t = Number.POSITIVE_INFINITY;
        for (const child of state.legalMoves) {
            const value = minMax(state.makeMove(child), maxPlayer, depth - 1);
            if (value <= t) {
                t = value;
            }
        }
        return t;
    }
}


export function MinMaxAgent(depth=5) {
    function minMaxWrapper(state: State): Move {
        nodes = 0;
        let t = Number.NEGATIVE_INFINITY;
        let tempMove = state.legalMoves[0];
        console.log(`Exploring all ${state.legalMoves.length} moves with a depth of ${depth}`)
        for (const child of state.legalMoves) {
            const value = minMax(state.makeMove(child), state.currentPlayer, depth-1);
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
