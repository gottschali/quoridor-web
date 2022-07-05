import { Move } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { Notation, State } from "../quoridor/State";
import { wallsHeuristic } from "./wallsHeuristic";


function getShortestPathFromDist() {

}

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
    return (30-d1) + d2 + 10 +  Math.random() * 5;
}

let nodes = 0;

export type Heuristic = null | ((state: State)=>Move[]);

function minMax(state: State, maxPlayer: Player, depth: number, heuristic: Heuristic) {
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
    if (state.currentPlayer === maxPlayer) {
        let t = Number.NEGATIVE_INFINITY;
        for (const child of state.children.values()) {
            const value = minMax(child, maxPlayer, depth - 1, heuristic);
            if (value >= t) {
                t = value;
            }
        }
        return t;
    } else {
        let t = Number.POSITIVE_INFINITY;
        for (const child of state.children.values()) {
            const value = minMax(child, maxPlayer, depth - 1, heuristic);
            if (value <= t) {
                t = value;
            }
        }
        return t;
    }
}


export function MinMaxAgent(depth=5, heuristic: Heuristic=null) {
    function minMaxWrapper(state: State): Notation {
        let t = Number.NEGATIVE_INFINITY;
        let tempMove = "";
        nodes = 0;
        console.log(`Exploring all ${state.children.size} children with a depth of ${depth}`)
        // const cands = heuristic === null ? state.legalMoves : heuristic(state);
        // console.log(`Heuristic: ${cands.length}`);
        for (const [move, child] of state.children.entries()) {
            const value = minMax(child, state.currentPlayer, depth-1, heuristic);
            if (value >= t) {
                t = value;
                tempMove = move;
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
