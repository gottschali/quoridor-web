import { Move, Orientation, WallMove } from "../quoridor/Move";
import { State } from "../quoridor/State";

export function wallsHeuristic(state: State): Move[] {
    const candidates: Move[] = [];
    /*
     * Instead: iterate over children notation/childState and prune somehow
     */
    // for (let move of state.legalMoves {
    //     if (isPawnMove(move)) candidates.push(move);
    //     else {
    //         const {square, orientation} = move as WallMove;
    //         const other = square.add(orientation === Orientation.Vertical ? new Coord(2, 0) : new Coord(0, 2));

    //         if (square.neighbours(1).some(c => c.equals(state.pawnPositions[state.currentPlayer]))) {
    //             candidates.push(move);
    //         } else if (square.neighbours(1).some(c => c.equals(state.pawnPositions[state.opponent]))) {
    //             candidates.push(move);
    //         }
    //         if (square.neighbours(3).some(c => c.equals(state.pawnPositions[state.currentPlayer]))) {
    //             candidates.push(move);
    //         } else if (square.neighbours(3).some(c => c.equals(state.pawnPositions[state.opponent]))) {
    //             candidates.push(move);
    //         }
    //         else {
    //             const x = new Set<Coord>();

    //             x.add(other.add(new Coord(1, 1)))
    //             x.add(other.add(new Coord(-1, -1)))
    //             x.add(other.add(new Coord(-1, 1)))
    //             x.add(other.add(new Coord(1, -1)))

    //             x.add(square.add(new Coord(1, 1)))
    //             x.add(square.add(new Coord(-1, -1)))
    //             x.add(square.add(new Coord(-1, 1)))
    //             x.add(square.add(new Coord(1, -1)))

    //             // x.forEach(c => {
    //             //     if (state.board[c.row][c.column]) {
    //             //         candidates.push(move);
    //             //     }
    //             // })
    //         }

    //     }
    // }
    return candidates;
}
