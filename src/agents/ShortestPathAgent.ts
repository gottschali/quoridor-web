import { Notation, posToString } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";


export async function shortestPathMove(state: State): Promise<Notation> {
    let d = Number.POSITIVE_INFINITY;
    let shortestMove = "INITIALIZED";
    for (const move of state.generatePawnMoves(state.pawnPositions[state.currentPlayer])) {
        const [row, col] = move.target;
        const dist = state.currentPlayer === Player.white ? state.board[row][col] : state.board[row-1][col-1];
        if (dist !== -1 && dist < d) {
            d = dist;
            shortestMove = posToString(move.target);
        }
    }

    return shortestMove;
}

export const ShortestPathAgent = {
    isMachine: true,
    name: 'ShortestPath',
    getMove: shortestPathMove,
};
